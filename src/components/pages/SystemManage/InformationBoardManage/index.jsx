import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Modal, notification } from "antd";
import { get, post } from "../../../../axios/index.jsx";
import { layout, tailLayout } from "../../../common/layoutStyle.js";
import MessageManage from "./MessageManage/index.jsx";
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
import { getParam } from "../../../../utils/getParam.js";
import EncryptModal from "../../../common/EncryptModal.jsx";
import { setMessages } from "../../../../store/messagesSlice.js";
import "./index.css";
import ComProTable from "../../../common/ComProTable.jsx";

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
  const isAdmin = useSelector((state) => state.login.isAdmin);
  const userId = useSelector((state) => {
    return state.login.userId;
  });

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
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [afterSuccess, setAfterSuccess] = useState(null);

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
    if (!(isAdmin || (board ? userId === board.createdBy : false))) {
      handleCancel();
      return;
    }

    const boardName = boardForm.getFieldValue("informationBoardName");
    const object = { boardName };
    if (board) object.id = board.id;
    const param = getParam(
      object,
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

  const batchDelete = () => {
    if (!selectedRowKeys.length) {
      api.error({
        message: `失败`,
        description: `没有勾选`,
      });
      return;
    }

    const param = getParam(
      selectedRowKeys,
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
    setAfterSuccess(() => {
      setSelectedRowKeys([]);
      setSelectedRows([]);
    });
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
      render: (text, row) => {
        const array = [
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
        ];
        if (isAdmin || userId === row.createdBy) {
          return array.concat([
            <a
              key={"delete"}
              onClick={() => {
                showDeleteModal(row);
              }}
            >
              删除
            </a>,
          ]);
        }
        return array;
      },
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

  const toolBarRender = () => {
    return [
      <Button onClick={showCreateModal} key={"create"}>
        新建信息板
      </Button>,
      <Button onClick={batchDelete} key={"batchDelete"}>
        批量删除
      </Button>,
    ];
  };

  return (
    <React.Fragment>
      {notificationContextHolder}

      <ComProTable
        getData={getData}
        reload={reload}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        columns={columns}
        toolBarRender={toolBarRender}
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
            <Input
              disabled={
                !(isAdmin || (board ? userId === board.createdBy : false))
              }
            />
          </Form.Item>
        </Form>
        {type === TYPES.EDIT && (
          <MessageManage
            board={board}
            disabled={
              !(isAdmin || (board ? userId === board.createdBy : false))
            }
          />
        )}
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
        afterSuccess={afterSuccess}
      />

      {modalContextHolder}
    </React.Fragment>
  );
}

export default InformationBoardManage;
