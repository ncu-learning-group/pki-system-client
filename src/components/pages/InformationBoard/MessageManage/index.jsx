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
import { getColumns } from "../../../common/getColumns.jsx";
import { get, post } from "../../../../axios/index.jsx";
import moment from "moment/moment.js";
import {
  BOARD_DELETE,
  BOARD_SAVE,
  MESSAGE_DELETE,
  MESSAGE_PAGE,
  MESSAGE_SAVE,
} from "../../../../axios/url.js";
import { layout } from "../../../common/layoutStyle.js";
import { useSelector } from "react-redux";
import { checkKey } from "../../../../utils/checkKey.js";
import { getParam } from "../../../../utils/getParam.js";
import { useForm } from "antd/es/form/Form.js";
import EncryptModal from "../../../common/EncryptModal.jsx";

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

  const { board } = props;

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

  const [encryptModalVisible, setEncryptModalVisible] = useState(false);
  const [encryptModalConfirmLoading, setEncryptModalConfirmLoading] =
    useState(false);
  const [saveUri, setSaveUri] = useState("");

  const ref = useRef();

  useEffect(() => {
    ref.current.reload();
  }, [reload]);

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
    const param = getParam(
      {
        message: messageContent.messageContent,
        boardId: board.id,
        id: !!message && message.id,
      },
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
      dataIndex: "createdBy",
    },
    {
      title: "创建时间",
      width: 120,
      dataIndex: "createdTime",
    },
    {
      title: "更新人",
      width: 120,
      dataIndex: "updatedBy",
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
            showEditModal(row);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          title="删除"
          description="你确定删除这条消息吗？"
          onConfirm={() => {
            return singleDelete(row)
              .then(() => {
                return Promise.resolve();
              })
              .catch(() => {
                return Promise.reject();
              });
          }}
          okText="是"
          cancelText="否"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
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

  return (
    <React.Fragment>
      {notificationContextHolder}
      <ProTable
        request={getData}
        search={false}
        actionRef={ref}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        columns={getColumns(columns)}
        dateFormatter="string"
        headerTitle="消息列表"
        toolBarRender={() => {
          return [<Button onClick={showCreateModal}>新建信息</Button>];
        }}
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
      />
    </React.Fragment>
  );
}

export default MessageManage;
