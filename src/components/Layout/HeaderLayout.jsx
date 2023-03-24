import React, { useEffect, useState } from "react";
import { Col, Image, Menu, Row } from "antd";
import icon from "../../assets/images/icon.png";
import { Header } from "antd/es/layout/layout.js";
import { useNavigate } from "react-router-dom";

function HeaderLayout(props) {
  const navigate = useNavigate();
  const { selectedKeys, setSelectedKeys } = props;

  useEffect(() => {
    setSelectedKeys([window.location.pathname]);
  }, []);

  const onMenuItemClick = (e) => {
    navigate(e.key);
    setSelectedKeys([e.key]);
  };

  return (
    <Header style={{ background: "white", display: "flex" }}>
      {/*<div style={{ backgroundImage: `url(${icon})`, width: "10%" }} />*/}
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
                key: "/DigitalSignature",
                label: "数字信封",
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
                label: "欢迎您，admin",
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
    </Header>
  );
}

export default HeaderLayout;
