import React, { useEffect, useRef, useState } from "react";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  notification,
  Popconfirm,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { get, post } from "../../../axios/index.jsx";
import {
  MESSAGE_PAGE,
  USER_DELETE,
  USER_PAGE,
  USER_REGISTER,
  USER_SAVE,
} from "../../../axios/url.js";
import moment from "moment";
import { layout } from "../../common/layoutStyle.js";
import { useForm } from "antd/es/form/Form.js";
import Register from "../../Login/Register.jsx";
import { md5 } from "../../../utils/md5.js";

function UserManage(props) {
  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const [editVisible, setEditVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const [form] = useForm();

  const ref = useRef(null);

  useEffect(() => {
    ref.current.reload();
  }, [reload]);

  const showDeleteModal = (row) => {
    modal.confirm({
      title: "刪除",
      content: `你確定要刪除用户:${row.userName}吗？`,
      onOk: () => {
        return singleDelete(row)
          .then((res) => {
            if (res.code === "SUCCESS") {
              setReload(!reload);
              api.success({
                message: `成功`,
                description: `删除成功`,
              });
              return Promise.resolve();
            } else {
              api.error({
                message: `失败`,
                description: `删除失败：${res.message}`,
              });
              return Promise.reject();
            }
          })
          .catch((reason) => {
            api.error({
              message: `失败`,
              description: `删除失败：${reason}`,
            });
            return Promise.reject();
          });
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
      title: "用户名",
      width: 80,
      dataIndex: "userName",
    },
    {
      title: "创建时间",
      width: 240,
      dataIndex: "createdTime",
    },
    {
      title: "操作",
      width: 180,
      key: "option",
      valueType: "option",
      render: (text, row, index) => [
        <a
          key="edit"
          onClick={() => {
            onEdit(row);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            showDeleteModal(row);
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const onEdit = (row) => {
    form.setFieldsValue({ ...row, confirmPassword: "", password: "" });
    setEditVisible(true);
  };

  const singleDelete = (row) => {
    return post(USER_DELETE, [row.id]);
  };

  const getData = async (params) => {
    const { current, pageSize } = params;
    const res = await get(USER_PAGE, {
      index: current,
      size: pageSize,
    });
    if (res.message === "success") {
      return {
        data: res.data.content,
        success: true,
      };
    }
  };

  const handleOk = () => {
    setConfirmLoading(true);
    form.validateFields().then((res) => {
      post(USER_SAVE, { ...res, password: md5(md5(res.password)) })
        .then((res) => {
          if (res.code === "SUCCESS") {
            setEditVisible(false);
            setReload(!reload);
            api.success({
              message: "成功",
              description: "注册成功",
            });
          } else {
            api.success({
              message: "失败",
              description: `注册失败：${res.message}`,
            });
          }
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    });
  };

  const handleCancel = () => {
    setEditVisible(false);
  };

  return (
    <React.Fragment>
      {notificationContextHolder}
      <ProTable
        actionRef={ref}
        reloa={reload}
        request={getData}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        columns={columns}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key={"create"}
            onClick={() => {
              setEditVisible(true);
            }}
          >
            创建用户
          </Button>,
          // <Button key={"delete"}>删除用户</Button>,
        ]}
      />

      <Register
        editVisible={editVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        confirmLoading={confirmLoading}
        form={form}
      />

      {modalContextHolder}
    </React.Fragment>
  );
}

export default UserManage;
