import React, { useEffect, useRef, useState } from "react";
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
import { get, post } from "../../../../../axios/index.jsx";
import moment from "moment/moment.js";
import {
  BOARD_DELETE,
  BOARD_SAVE,
  MESSAGE_DELETE,
  MESSAGE_PAGE,
  MESSAGE_SAVE,
} from "../../../../../axios/url.js";
import { layout } from "../../../../common/layoutStyle.js";
import { useSelector } from "react-redux";
import { checkKey } from "../../../../../utils/checkKey.js";
import { encryptParam } from "../../../../../utils/encryptParam.js";
import { useForm } from "antd/es/form/Form.js";
import EncryptModal from "../../../../common/EncryptModal.jsx";
import ComProTable from "../../../../common/ComProTable.jsx";

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

  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [encryptModalConfirmLoading, setEncryptModalConfirmLoading] =
    useState(false);
  const [saveUri, setSaveUri] = useState("");

  const showCreateModal = () => {
    setType(TYPES.CREATE);
    setMessage(null);
    messageForm.setFieldsValue({ messageContent: null });
    setEditVisible(true);
  };

  const showEditModal = (row) => {
    setType(TYPES.EDIT);
    setMessage(row);
    messageForm.setFieldsValue({ messageContent: row.message });
    setEditVisible(true);
  };

  const handleOk = async () => {
    const messageContent = await messageForm.validateFields().catch(() => {
      api.error({
        message: "错误",
        description: "消息的输入有问题",
      });
    });
    const object = {
      message: messageContent.messageContent,
      boardId: board.id,
    };
    if (message) object.id = message.id;

    const param = encryptParam(
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
  };

  const handleCancel = () => {
    messageForm.resetFields(["messageContent"]);
    setEditVisible(false);
  };

  const singleDelete = (row) => {
    const param = encryptParam(
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

    const param = encryptParam(
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
    {
      title: "消息内容",
      width: 240,
      dataIndex: "message",
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
    const res = await get(MESSAGE_PAGE, {
      index: current,
      size: pageSize,
      boardId: board.id,
    });
    if (res.message === "success") {
      return {
        data: res.data.content,
        success: true,
      };
    }
  };

  const toolBarRender = () => {
    const array = [<Button onClick={showCreateModal}>新建信息</Button>];
    if (!disabled) {
      array.push(
        <Button onClick={batchDelete} key={"batchDelete"}>
          批量删除
        </Button>
      );
    }
    return array;
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
        width={1500}
      >
        <Form form={messageForm} {...layout} style={{ marginTop: "3rem" }}>
          <Form.Item
            name="messageContent"
            label="消息内容"
            rules={[
              {
                required: true,
              },
              {
                type: "string",
                max: 32,
                message: "消息的最大长度为32",
              },
            ]}
          >
            <Input />
          </Form.Item>
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
