import { useEffect, useRef, useState } from "react";
import "./KeyFrame.css";

function KeyFrame(props) {
  const { content, id, speed } = props;

  const marqueeContainerKey = `marquee-container-${id}`;
  const marqueeContentKey = `marquee-content-${id}`;

  useEffect(() => {
    const containerWidth =
      document.getElementById(marqueeContainerKey).offsetWidth; // 跑马灯容器宽度
    const boxWidth = document.getElementById(marqueeContentKey).offsetWidth; // 跑马灯内容宽度
    const duration =
      Math.ceil((boxWidth * 2 + containerWidth) / speed) + 3 + "s"; // 动画时间，这里我没有四舍五入，你可以进行四舍五入
    document.getElementById(marqueeContentKey).style.cssText =
      "animation-duration:" + duration;
  }, []);

  return (
    <div
      className={"marquee-container"}
      key={marqueeContainerKey}
      id={marqueeContainerKey}
    >
      <div
        className={"marquee-content"}
        key={marqueeContentKey}
        id={marqueeContentKey}
      >
        {content}
      </div>
    </div>
  );
}

export default KeyFrame;
