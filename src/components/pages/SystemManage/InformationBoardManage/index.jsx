import React, { useEffect, useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Select,
  Slider,
  Tooltip,
} from "antd";
import { getColumns } from "../../../common/getColumns.jsx";
import { get, post } from "../../../../axios/index.jsx";
import { layout, tailLayout } from "../../../common/layoutStyle.js";
import moment from "moment";
import MessageManage from "../../InformationBoard/MessageManage/index.jsx";
import { encryptContent } from "../../../../utils/aes.js";
import { md5 } from "../../../../utils/md5.js";
import { encryptKey } from "../../../../utils/rsa.js";
import {
  BOARD_DELETE,
  BOARD_PAGE,
  BOARD_SAVE,
  MESSAGE_DELETE,
  MESSAGE_PAGE,
  SEND,
} from "../../../../axios/url.js";
import { useForm } from "antd/es/form/Form.js";
import { useDispatch, useSelector } from "react-redux";
import { checkKey } from "../../../../utils/checkKey.js";
import { getParam } from "../../../../utils/getParam.js";
import EncryptModal from "../../../common/EncryptModal.jsx";
import { pagination } from "../../../common/pagination.js";
import { setMessages } from "../../../../store/messagesSlice.js";

const TYPES = {
  CREATE: "create",
  EDIT: "edit",
};

function InformationBoardManage(props) {
  const asymmetricCryptographicAlgorithm = useSelector(
    (state) => state.key.asymmetricCryptographicAlgorithm
  );
  const asymmetricCryptographicKey = useSelector(
    (state) => state.key.asymmetricCryptographicKey
  );
  const symmetricEncryptionAlgorithm = useSelector(
    (state) => state.key.symmetricEncryptionAlgorithm
  );
  const symmetricEncryptionKey = useSelector(
    (state) => state.key.symmetricEncryptionKey
  );
  const symmetricEncryptionAlgorithmIV = useSelector(
    (state) => state.key.symmetricEncryptionAlgorithmIV
  );
  const hashAlgorithm = useSelector((state) => state.key.hashAlgorithm);

  const dispatch = useDispatch();

  const [symmetricKeyCiphertext, setSymmetricKeyCiphertext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [sign, setSign] = useState("");

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const [boardForm] = useForm();

  const [editVisible, setEditVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [type, setType] = useState(null);
  const [board, setBoard] = useState(null);
  const [reload, setReload] = useState(false);

  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [encryptModalConfirmLoading, setEncryptModalConfirmLoading] =
    useState(false);
  const [saveUri, setSaveUri] = useState("");

  const ref = useRef();

  useEffect(() => {
    ref.current.reload();
  }, [reload]);

  const showPlayModal = (row) => {
    modal.confirm({
      title: "播放",
      content: `是否要播放信息板：${row.boardName}`,
      onOk: () => {
        get(MESSAGE_PAGE, { boardId: row.id }).then((res) => {
          const test = res.data.content.map((item) => {
            return item.message;
          });
          if (res.code === "SUCCESS") {
            dispatch(
              setMessages(
                res.data.content.map((item) => {
                  return item.message;
                })
              )
            );
            api.success({
              message: `成功`,
              description: `开始播放信息板：${row.boardName} `,
            });
          }
        });
      },
      onCancel: () => {},
      okText: "是",
      cancelText: "否",
    });
  };

  const showCreateModal = () => {
    setType(TYPES.CREATE);
    setBoard(null);
    boardForm.setFieldsValue({ informationBoardName: null });
    setEditVisible(true);
  };

  const showEditModal = (row) => {
    setType(TYPES.EDIT);
    setBoard(row);
    boardForm.setFieldsValue({ informationBoardName: row.boardName });
    setEditVisible(true);
  };

  const handleOk = () => {
    const boardName = boardForm.getFieldValue("informationBoardName");
    const param = getParam(
      { boardName, id: !!board && board.id },
      asymmetricCryptographicKey,
      symmetricEncryptionKey,
      symmetricEncryptionAlgorithmIV
    );
    const { symmetricKeyCiphertext, ciphertext, sign } = param;
    setCiphertext(ciphertext);
    setSymmetricKeyCiphertext(symmetricKeyCiphertext);
    setSign(sign);

    setSaveUri(BOARD_SAVE);
    setEncryptModalVisible(true);
    setEncryptModalConfirmLoading(true);
  };

  const handleCancel = () => {
    boardForm.resetFields(["informationBoardName"]);
    setEditVisible(false);
  };

  const singleDelete = (row) => {
    const param = getParam(
      [row.id],
      asymmetricCryptographicKey,
      symmetricEncryptionKey,
      symmetricEncryptionAlgorithmIV
    );
    const { symmetricKeyCiphertext, ciphertext, sign } = param;
    setCiphertext(ciphertext);
    setSymmetricKeyCiphertext(symmetricKeyCiphertext);
    setSign(sign);
    setSaveUri(BOARD_DELETE);

    setEncryptModalVisible(true);
    setEncryptModalConfirmLoading(true);
  };

  const showDeleteModal = (row) => {
    modal.confirm({
      title: "刪除",
      content: `你確定要刪除信息板:${row.id}吗？`,
      onOk: () => {
        singleDelete(row);
        return Promise.resolve();
      },
      onCancel: () => {
        return Promise.resolve();
      },
    });
  };

  const columns = [
    {
      title: "序号",
      width: 80,
      render: (text, row, index) => index + 1,
    },
    {
      title: "信息板名称",
      width: 120,
      dataIndex: "boardName",
    },
    {
      title: "信息板包含的消息条数",
      width: 240,
      dataIndex: "key",
    },
    {
      title: "创建人",
      width: 120,
      dataIndex: "createdUserName",
    },
    {
      title: "创建时间",
      width: 120,
      dataIndex: "createdTime",
    },
    {
      title: "更新人",
      width: 120,
      dataIndex: "updatedUserName",
    },
    {
      title: "更新时间",
      width: 120,
      dataIndex: "updatedTime",
    },
    {
      title: "操作",
      width: 180,
      key: "option",
      valueType: "option",
      render: (text, row) => [
        <a
          onClick={() => {
            showPlayModal(row);
          }}
        >
          播放
        </a>,
        <a
          onClick={() => {
            showEditModal(row);
          }}
        >
          编辑
        </a>,
        <a
          key={"delete"}
          onClick={() => {
            showDeleteModal(row);
          }}
        >
          删除
        </a>,
        // <Popconfirm
        //   title="删除"
        //   description="你确定删除这条消息吗？"
        //   onConfirm={() => {
        //     return singleDelete(row)
        //       .then(() => {
        //         return Promise.resolve();
        //       })
        //       .catch(() => {
        //         return Promise.reject();
        //       });
        //   }}
        //   okText="是"
        //   cancelText="否"
        // >
        //   <a>删除</a>
        // </Popconfirm>,
      ],
    },
  ];

  const getData = async (params) => {
    const { current, pageSize } = params;
    const res = await get(BOARD_PAGE, { index: current, size: pageSize });
    if (res.message === "success") {
      return {
        data: res.data.content,
        success: true,
        total: res.data.totalElements,
      };
    }
  };

  return (
    <React.Fragment>
      {notificationContextHolder}
      <ProTable
        request={getData}
        actionRef={ref}
        reload={reload}
        rowKey="key"
        search={false}
        pagination={pagination}
        columns={getColumns(columns)}
        dateFormatter="string"
        headerTitle="消息板列表"
        toolBarRender={() => {
          return [<Button onClick={showCreateModal}>新建信息板</Button>];
        }}
      />

      <Modal
        title={type === TYPES.EDIT ? "编辑信息板" : "新建信息板"}
        open={editVisible}
        onOk={handleOk}
        okText={"确定"}
        cancelText={"取消"}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1500}
      >
        <Form form={boardForm} {...layout} style={{ marginTop: "3rem" }}>
          <Form.Item
            name="informationBoardName"
            label="信息板名称"
            rules={[
              {
                required: true,
                message: "信息板名称不能为空",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
        {type === TYPES.EDIT && <MessageManage board={board} />}
      </Modal>

      <EncryptModal
        onClose={() => {
          setEditVisible(false);
          setReload(!reload);
        }}
        open={encryptModalVisible}
        setOpen={setEncryptModalVisible}
        confirmLoading={encryptModalConfirmLoading}
        setConfirmLoading={setEncryptModalConfirmLoading}
        symmetricKeyCiphertext={symmetricKeyCiphertext}
        ciphertext={ciphertext}
        sign={sign}
        saveUri={saveUri}
      />

      {modalContextHolder}
    </React.Fragment>
  );
}

export default InformationBoardManage;
