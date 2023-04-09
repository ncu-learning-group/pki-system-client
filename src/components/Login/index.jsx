import {
  AlipayOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoOutlined,
  UserOutlined,
  WeiboOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  notification,
  Space,
  Tabs,
} from "antd";
import { useNavigate } from "react-router-dom";
import "./index.css";
import { post } from "../../axios/index.jsx";
import { USER_LOGIN, USER_REGISTER } from "../../axios/url.js";
import { useForm } from "antd/es/form/Form.js";
import { useDispatch } from "react-redux";
import { setFirstIn, setUserName } from "../../store/loginSlice.js";
import { layout } from "../common/layoutStyle.js";
import MessageManage from "../pages/SystemManage/InformationBoardManage/MessageManage/index.jsx";
import { md5 } from "../../utils/md5.js";
import Register from "./Register.jsx";

const iconStyles = {
  color: "rgba(0, 0, 0, 0.2)",
  fontSize: "18px",
  verticalAlign: "middle",
  cursor: "pointer",
};

const Login = () => {
  const [loginType, setLoginType] = useState("account");

  const navigator = useNavigate();

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const [checked, setChecked] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [form] = useForm();

  const login = (userName, password) => {
    post(USER_LOGIN, {
      userName,
      password: md5(md5(password)),
    }).then((res) => {
      if (res.code === "SUCCESS") {
        navigator("/");
      } else {
        api.error({
          message: `失败`,
          description: `登录失败：用户名或者密码错误`,
        });
      }
    });
  };

  const handleOk = () => {
    setConfirmLoading(true);
    form.validateFields().then((res) => {
      post(USER_REGISTER, { ...res, password: md5(md5(res.password)) })
        .then((res) => {
          if (res.code === "SUCCESS") {
            setEditVisible(false);
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
    <div className={"login"}>
      {notificationContextHolder}
      <LoginFormPage
        backgroundImageUrl="src/assets/images/OIP-C.jpg"
        logo="src/assets/images/数据展示.svg"
        title="PKI-SYSTEM"
        subTitle="数字信封加密解密"
        onFinish={({ username, password }) => {
          login(username, password);
        }}
        actions={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            {/*<Divider plain>*/}
            {/*  <span*/}
            {/*    style={{ color: "#CCC", fontWeight: "normal", fontSize: 14 }}*/}
            {/*  >*/}
            {/*    其他登录方式*/}
            {/*  </span>*/}
            {/*</Divider>*/}
            {/*<Space align="center" size={24}>*/}
            {/*  <div*/}
            {/*    style={{*/}
            {/*      display: "flex",*/}
            {/*      justifyContent: "center",*/}
            {/*      alignItems: "center",*/}
            {/*      flexDirection: "column",*/}
            {/*      height: 40,*/}
            {/*      width: 40,*/}
            {/*      border: "1px solid #D4D8DD",*/}
            {/*      borderRadius: "50%",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <AlipayOutlined style={{ ...iconStyles, color: "#1677FF" }} />*/}
            {/*  </div>*/}
            {/*  <div*/}
            {/*    style={{*/}
            {/*      display: "flex",*/}
            {/*      justifyContent: "center",*/}
            {/*      alignItems: "center",*/}
            {/*      flexDirection: "column",*/}
            {/*      height: 40,*/}
            {/*      width: 40,*/}
            {/*      border: "1px solid #D4D8DD",*/}
            {/*      borderRadius: "50%",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <TaobaoOutlined style={{ ...iconStyles, color: "#FF6A10" }} />*/}
            {/*  </div>*/}
            {/*  <div*/}
            {/*    style={{*/}
            {/*      display: "flex",*/}
            {/*      justifyContent: "center",*/}
            {/*      alignItems: "center",*/}
            {/*      flexDirection: "column",*/}
            {/*      height: 40,*/}
            {/*      width: 40,*/}
            {/*      border: "1px solid #D4D8DD",*/}
            {/*      borderRadius: "50%",*/}
            {/*    }}*/}
            {/*  >*/}
            {/*    <WeiboOutlined style={{ ...iconStyles, color: "#333333" }} />*/}
            {/*  </div>*/}
            {/*</Space>*/}
          </div>
        }
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey)}
        >
          <Tabs.TabPane key={"account"} tab={"账号密码登录"} />
          {/*<Tabs.TabPane key={"phone"} tab={"手机号登录"} />*/}
        </Tabs>
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined className={"prefixIcon"} />,
              }}
              placeholder={"用户名: admin or user"}
              rules={[
                {
                  required: true,
                  message: "请输入用户名!",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              placeholder={"密码: ant.design"}
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
            />
          </>
        )}
        {loginType === "phone" && (
          <>
            <ProFormText
              fieldProps={{
                size: "large",
                prefix: <MobileOutlined className={"prefixIcon"} />,
              }}
              name="mobile"
              placeholder={"手机号"}
              rules={[
                {
                  required: true,
                  message: "请输入手机号！",
                },
                {
                  pattern: /^1\d{10}$/,
                  message: "手机号格式错误！",
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: "large",
                prefix: <LockOutlined className={"prefixIcon"} />,
              }}
              captchaProps={{
                size: "large",
              }}
              placeholder={"请输入验证码"}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${"获取验证码"}`;
                }
                return "获取验证码";
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: "请输入验证码！",
                },
              ]}
              onGetCaptcha={async () => {
                message.success("获取验证码成功！验证码为：1234");
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <Checkbox
            noStyle
            name="autoLogin"
            checked={checked}
            onClick={() => {
              setEditVisible(true);
            }}
          >
            自动登录
          </Checkbox>
          <a
            style={{
              float: "right",
            }}
            onClick={() => {
              setEditVisible(true);
            }}
          >
            注册用户
          </a>
        </div>
      </LoginFormPage>

      <Register
        editVisible={editVisible}
        handleOk={handleOk}
        handleCancel={handleCancel}
        confirmLoading={confirmLoading}
        form={form}
      />

      {modalContextHolder}
    </div>
  );
};

export default Login;
