import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout.js";

import background from "../../assets/images/dashboard-background.jpg";
import HeaderLayout from "./HeaderLayout.jsx";
import FooterLayout from "./FooterLayout.jsx";
import GlobalRouter from "../../axios/GlobalRouter.js";
import { regenerateSymmetricEncryptionKey } from "../../utils/aes.js";
import { setSymmetricEncryptionKey } from "../../store/keySlice.js";
import { useDispatch } from "react-redux";
import { getAsymmetricCryptographicKey } from "../../utils/getAsymmetricCryptographicKey.js";

function RootLayout(props) {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const menu = { selectedKeys, setSelectedKeys };

  const dispatch = useDispatch();
  const navigate = useNavigate();
  GlobalRouter.navigate = useNavigate();

  useEffect(() => {
    getAsymmetricCryptographicKey(dispatch);

    const symmetricEncryptionKey = regenerateSymmetricEncryptionKey();
    dispatch(setSymmetricEncryptionKey(symmetricEncryptionKey));
  }, []);

  return (
    <Layout
      className="layout"
      style={{ backgroundImage: `url(${background})` }}
    >
      <HeaderLayout {...menu} />
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        {/*<Breadcrumb*/}
        {/*  style={{*/}
        {/*    margin: "16px 0",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
        {/*  <Breadcrumb.Item>List</Breadcrumb.Item>*/}
        {/*  <Breadcrumb.Item>App</Breadcrumb.Item>*/}
        {/*</Breadcrumb>*/}
        <div className="site-layout-content">
          <Outlet context={menu} />
        </div>
      </Content>
      <FooterLayout />
    </Layout>
  );
}

export default RootLayout;
