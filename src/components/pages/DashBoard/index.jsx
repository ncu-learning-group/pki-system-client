import React from "react";
import FeaturesBlocks from "./FeaturesBlocks.jsx";
import FeaturesZigzag from "./FeaturesZigzag.jsx";

import "./index.css";

function DashBoard(props) {
  const { selectedKeys, setSelectedKeys } = props;
  const menu = { selectedKeys, setSelectedKeys };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      {/*<Header />*/}

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
