import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout.js";
import Sider from "antd/es/layout/Sider.js";

function SystemManage(props) {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    setSelectedKeys([window.location.pathname]);
  }, []);

  const onMenuItemClick = (e) => {
    navigate(e.key);
    setSelectedKeys([e.key]);
  };

  return (
    <Layout style={{ height: "50rem", margin: "1rem" }}>
      <Sider
        style={{
          backgroundColor: "white",
        }}
      >
        <Menu
          selectedKeys={selectedKeys}
          onClick={onMenuItemClick}
          style={{ padding: "0.5rem 0" }}
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "/SystemManage",
              label: "用户管理",
            },
            {
              key: "AboutUs",
              label: "关于我们",
            },
          ]}
        />
      </Sider>
      <Content style={{ backgroundColor: "white" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default SystemManage;
