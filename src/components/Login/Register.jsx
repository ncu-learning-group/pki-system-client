import React from "react";
import { Form, Input, Modal } from "antd";
import { layout } from "../common/layoutStyle.js";

function Register(props) {
  const { editVisible, handleOk, handleCancel, confirmLoading, form } = props;

  return (
    <Modal
      title={"用户注册"}
      okText={"确定"}
      cancelText={"取消"}
      width={1000}
      open={editVisible}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      onCancel={handleCancel}
    >
      <Form form={form} {...layout} style={{ marginTop: "3rem" }}>
        <Form.Item
          name="userName"
          label="用户名"
          rules={[
            {
              required: true,
              message: "form不能为空",
            },
            {
              pattern: /^[a-zA-Z0-9_-]{4,16}$/,
              message: "4到16位（字母，数字，下划线，减号）",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密码"
          dependencies={["confirmPassword"]}
          rules={[
            {
              required: true,
              message: "密码不能为空",
            },
            {
              pattern: /^[a-zA-Z0-9_-]{4,16}$/,
              message: "4到16位（字母，数字，下划线，减号）",
            },
            ({ getFieldValue }) => {
              return {
                validator(_, value) {
                  if (
                    !getFieldValue("confirmPassword") ||
                    getFieldValue("confirmPassword") === value
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error("密码和确认密码必须一致"));
                  }
                },
              };
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="确认密码"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "密码不能为空",
            },
            {
              pattern: /^[a-zA-Z0-9_-]{4,16}$/,
              message: "4到16位（字母，数字，下划线，减号）",
            },
            ({ getFieldValue }) => {
              return {
                validator(_, value) {
                  if (
                    !getFieldValue("password") ||
                    getFieldValue("password") === value
                  ) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error("密码和确认密码必须一致"));
                  }
                },
              };
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default Register;
