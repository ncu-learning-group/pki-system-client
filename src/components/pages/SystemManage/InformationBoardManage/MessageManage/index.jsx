import React, { Fragment, useEffect, useRef, useState } from "react";
import { ProTable } from "@ant-design/pro-components";
import {
  Button,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
  Tooltip,
} from "antd";
import { getColumns } from "../../../../common/getColumns.jsx";
import { get, post, postFile } from "../../../../../axios/index.jsx";
import moment from "moment/moment.js";
import {
  BOARD_DELETE,
  BOARD_SAVE,
  MESSAGE_DELETE,
  MESSAGE_PAGE,
  MESSAGE_PAGE_IMAGE,
  MESSAGE_SAVE,
  MESSAGE_SAVE_IMAGE,
} from "../../../../../axios/url.js";
import { layout } from "../../../../common/layoutStyle.js";
import { useSelector } from "react-redux";
import { checkKey } from "../../../../../utils/checkKey.js";
import { getParam } from "../../../../../utils/getParam.js";
import { useForm } from "antd/es/form/Form.js";
import EncryptModal from "../../../../common/EncryptModal.jsx";
import ComProTable from "../../../../common/ComProTable.jsx";
import ComUpload from "../../../../common/ComUpload.jsx";

const TYPES = {
  CREATE: "create",
  EDIT: "edit",
};

function MessageManage(props) {
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

  const { board, disabled } = props;
  const informationBoardType = board.boardType === "1" ? "TEXT" : "PICTURE";

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const [messageForm] = useForm();

  const [editVisible, setEditVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [type, setType] = useState(null);
  const [message, setMessage] = useState(null);
  const [reload, setReload] = useState(false);
  const [symmetricKeyCiphertext, setSymmetricKeyCiphertext] = useState("");
  const [ciphertext, setCiphertext] = useState("");
  const [sign, setSign] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [afterSuccess, setAfterSuccess] = useState(null);
  const [fileList, setFileList] = useState([]);

  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [encryptModalConfirmLoading, setEncryptModalConfirmLoading] =
    useState(false);
  const [saveUri, setSaveUri] = useState("");

  const showCreateModal = () => {
    setType(TYPES.CREATE);
    setMessage(null);
    if (informationBoardType === "TEXT")
      messageForm.setFieldsValue({ messageContent: null });
    else {
      // setFileList([
      //   {
      //     uid: "-1",
      //     name: "xxx.png",
      //     status: "done",
      //     url: "http://www.baidu.com/xxx.png",
      //   },
      // ]);
    }
    setEditVisible(true);
  };

  const showEditModal = (row) => {
    setType(TYPES.EDIT);
    setMessage(row);
    if (informationBoardType === "TEXT")
      messageForm.setFieldsValue({ messageContent: row.message });
    else {
      // setFileList([
      //   {
      //     uid: "-1",
      //     name: "xxx.png",
      //     status: "done",
      //     url: "http://www.baidu.com/xxx.png",
      //   },
      // ]);
    }
    setEditVisible(true);
  };

  const handleOk = async () => {
    const res = await messageForm
      .validateFields()
      .then((res) => {
        api.info({
          message: "提示",
          description: "导入中,请勿关闭弹窗!",
        });
        return res;
      })
      .catch(() => {
        api.error({
          message: "错误",
          description: "消息的输入有问题",
        });
      });
    if (informationBoardType === "TEXT") {
      const object = {
        message: res.messageContent,
        boardId: board.id,
      };
      if (message) object.id = message.id;

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
      setSaveUri(MESSAGE_SAVE);

      setEncryptModalVisible(true);
      setEncryptModalConfirmLoading(true);
    } else {
      const formData = new FormData();
      const [file] = fileList;
      if (file) {
        formData.append("file", file);
      }
      formData.append("boardId", board.id);
      formData.append("messageName", res.messageName);
      setConfirmLoading(true);

      getUploadData(formData)
        .then((res) => {
          if (res.code === "SUCCESS") {
            setEditVisible(false);
            setReload(!reload);
            api.success({
              message: "成功",
              description: "导入成功!",
            });
          } else {
            api.error({
              message: "失败",
              description: res.message || "操作失败",
            });
          }
        })
        .catch((error) => {
          api.error({
            message: "错误",
            description: "操作失败",
          });
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  const handleCancel = () => {
    messageForm.resetFields(["messageContent"]);
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
    setSaveUri(MESSAGE_DELETE);

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
    setSaveUri(MESSAGE_DELETE);

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
      content: `你確定要刪除消息:${row.id}吗？`,
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
    informationBoardType === "TEXT"
      ? {
          title: "消息内容",
          width: 240,
          dataIndex: "message",
        }
      : {
          title: "消息名称",
          width: 240,
          dataIndex: "messageName",
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
        const array = [];
        if (!disabled) {
          return array.concat([
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
          ]);
        }
        return array;
      },
    },
  ];

  const getData = async (params) => {
    const { current, pageSize } = params;
    const res = await get(
      informationBoardType === "TEXT" ? MESSAGE_PAGE : MESSAGE_PAGE_IMAGE,
      {
        index: current,
        size: pageSize,
        boardId: board.id,
      }
    );
    if (res.message === "success") {
      return {
        data: res.data.content,
        success: true,
      };
    }
  };

  const toolBarRender = () => {
    const array = [
      <Button type={"primary"} onClick={showCreateModal}>
        新建信息
      </Button>,
    ];
    if (!disabled) {
      array.push(
        <Button danger onClick={batchDelete} key={"batchDelete"}>
          批量删除
        </Button>
      );
    }
    return array;
  };

  // https://www.mocky.io/v2/5cc8019d300000980a055e76
  const getUploadData = (formData) => {
    return postFile(MESSAGE_SAVE_IMAGE, formData);
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
        title={type === TYPES.EDIT ? "编辑信息" : "新建信息"}
        open={editVisible}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
        okText={"确定"}
        cancelText={"取消"}
        width={informationBoardType === "TEXT" ? 1500 : 500}
        maskClosable={false}
        destroyOnClose
      >
        <Form form={messageForm} {...layout} style={{ marginTop: "3rem" }}>
          {/*创建图片消息和文字消息的区别*/}
          {informationBoardType === "TEXT" ? (
            <Form.Item
              name="messageContent"
              label="消息内容"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : (
            <Fragment>
              <Form.Item
                name="messageName"
                label="消息名称"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="fileList" label="图片">
                <ComUpload
                  getUploadData={getUploadData}
                  fileList={fileList}
                  setFileList={setFileList}
                />
              </Form.Item>
            </Fragment>
          )}
        </Form>
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

export default MessageManage;
