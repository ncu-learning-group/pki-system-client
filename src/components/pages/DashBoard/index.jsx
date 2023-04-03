import React, { useEffect } from "react";
import FeaturesBlocks from "./FeaturesBlocks.jsx";
import FeaturesZigzag from "./FeaturesZigzag.jsx";

import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { notification } from "antd";
import { setFirstIn } from "../../../store/loginSlice.js";

function DashBoard(props) {
  const { selectedKeys, setSelectedKeys } = props;
  const menu = { selectedKeys, setSelectedKeys };

  const [api, notificationContextHolder] = notification.useNotification();

  const dispatch = useDispatch();
  const firstIn = useSelector((state) => state.login.firstIn);

  let ignore = false;

  useEffect(() => {
    if (firstIn && !ignore) {
      ignore = true;
      dispatch(setFirstIn(false));
      api.success({
        message: `成功`,
        description: `登录成功`,
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      {/*<Header />*/}

      {notificationContextHolder}
      {/*  Page content */}
      <main className="grow">
        {/*  Page illustration */}
        {/*<div className="relative max-w-6xl mx-auto h-0 pointer-events-none" aria-hidden="true">*/}
        {/*  <PageIllustration />*/}
        {/*</div>*/}
        {/*  Page sections */}
        {/*<HeroHome />*/}
        <FeaturesBlocks {...menu} />
        {/*<FeaturesZigzag />*/}
        {/*<Testimonials />*/}
        {/*<Newsletter />*/}
      </main>

      {/*<Banner />*/}

      {/*  Site footer */}
      {/*<Footer />*/}
    </div>
  );
}

export default DashBoard;
