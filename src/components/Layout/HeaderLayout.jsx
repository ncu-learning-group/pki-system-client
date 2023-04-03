import React, { useEffect, useState } from "react";
import { Col, Image, Menu, Modal, notification, Row } from "antd";
import icon from "../../assets/images/icon.png";
import { Header } from "antd/es/layout/layout.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { post } from "../../axios/index.jsx";
import { GET_USERNAME } from "../../axios/url.js";

function HeaderLayout(props) {
  const navigate = useNavigate();
  const { selectedKeys, setSelectedKeys } = props;

  const [userName, setUserName] = useState(null);

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  useEffect(() => {
    setSelectedKeys([window.location.pathname]);
  }, []);

  useEffect(() => {
    post(GET_USERNAME, {})
      .then((res) => {
        if (res.code === "SUCCESS") {
          setUserName(res.data);
        } else {
          api.error({
            message: `失败`,
            description: `对话已经过期`,
          });
        }
      })
      .catch((reason) => {
        api.error({
          message: `失败`,
          description: `对话已经过期`,
        });
      });
  }, []);

  const onMenuItemClick = (e) => {
    navigate(e.key);
    setSelectedKeys([e.key]);
  };

  return (
    <Header style={{ background: "white", display: "flex" }}>
      {/*<div style={{ backgroundImage: `url(${icon})`, width: "10%" }} />*/}
      {modalContextHolder}
      <Row style={{ width: "100%" }}>
        <Col span={4} style={{ height: "100%" }}>
          <Image
            height={"98%"}
            src={icon}
            preview={false}
            onClick={() => {
              navigate("/");
              setSelectedKeys(["/"]);
            }}
          />
        </Col>
        <Col span={16}>
          <Menu
            selectedKeys={selectedKeys}
            onClick={onMenuItemClick}
            style={{ padding: "0 30px" }}
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "/",
                label: "首页",
              },
              {
                key: "/KeyManage",
                label: "密钥管理",
              },
              {
                key: "/InformationBoard",
                label: "信息板管理",
              },
              {
                key: "/SystemManage",
                label: "系统管理",
              },
            ]}
          />
        </Col>
        <Col span={3}>
          <Menu
            onClick={(e) => {
              if (e.key === "exit") {
                navigate("/Login");
              }
            }}
            style={{ padding: "0 30px" }}
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "welcome",
                label: `欢迎您，${userName}`,
                children: [
                  {
                    key: "exit",
                    label: "退出登录",
                  },
                ],
              },
            ]}
          />
        </Col>
      </Row>
      {notificationContextHolder}
    </Header>
  );
}

export default HeaderLayout;
