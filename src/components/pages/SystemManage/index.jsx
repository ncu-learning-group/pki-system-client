import React, { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { Content } from "antd/es/layout/layout.js";
import Sider from "antd/es/layout/Sider.js";
import { useSelector } from "react-redux";

function SystemManage(props) {
  const navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState([]);

  const isAdmin = useSelector((state) => {
    return state.login.isAdmin;
  });

  useEffect(() => {
    setSelectedKeys([window.location.pathname]);
  }, []);

  const onMenuItemClick = (e) => {
    navigate(e.key);
    setSelectedKeys([e.key]);
  };

  const getItems = () => {
    const array = [
      {
        key: "/SystemManage",
        label: "播放管理",
      },
    ];
    if (isAdmin)
      array.push({
        key: "/SystemManage/UserManage",
        label: "用户管理",
      });
    array.push({
      key: "/SystemManage/AboutUs",
      label: "关于我们",
    });
    return array;
  };

  return (
    <Layout style={{ height: "80rem", margin: "1rem" }}>
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
          items={getItems()}
        />
      </Sider>
      <Content style={{ backgroundColor: "white" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default SystemManage;
