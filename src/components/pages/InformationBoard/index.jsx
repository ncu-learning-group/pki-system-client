import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Form,
  notification,
  Result,
  Slider,
} from "antd";
import { SettingOutlined } from "@ant-design/icons";
import KeyFrame from "./KeyFrame/KeyFrame.jsx";
import { useForm } from "antd/es/form/Form.js";
import { layout, tailLayout } from "../../common/layoutStyle.js";
import InformationBoardManage from "../SystemManage/InformationBoardManage/index.jsx";
import { useSelector } from "react-redux";

function InformationBoard(props) {
  const [form1] = useForm();
  const [form2] = useForm();

  const [api, contextHolder] = notification.useNotification();

  const messages = useSelector((state) => state.message.messages);
  const [speed, setSpeed] = useState(300);

  // ******************文字滚动******************************
  const [textSetting, setTextSetting] = useState(false);
  // ******************文字滚动******************************

  // ******************图片滚动******************************
  const [imageSetting, setImageSetting] = useState(false);
  // ******************图片滚动******************************

  const saveTextSetting = () => {
    form1
      .validateFields()
      .then((res) => {
        setSpeed(res.playSpeed);
        setTextSetting(false);
        api.success({
          message: `成功`,
          description: `成功保存设置 `,
        });
      })
      .catch(() => {
        api.error({
          message: `错误`,
          description: `无法保存设置：输入的参数有误`,
        });
      });
  };

  const saveImageSetting = () => {
    form2
      .validateFields()
      .then((res) => {
        api.success({
          message: `成功`,
          description: `成功保存设置 `,
        });
      })
      .catch(() => {
        api.error({
          message: `错误`,
          description: `无法保存设置：输入的参数有误`,
        });
      });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <Card
        title="文字滚动"
        style={{ margin: "10px" }}
        extra={
          <>
            <SettingOutlined
              onClick={() => {
                setTextSetting(!textSetting);
              }}
            />
          </>
        }
      >
        {!textSetting ? (
          messages.length ? (
            <>
              {messages.map((value, index, array) => {
                return (
                  <KeyFrame
                    key={index}
                    id={index}
                    content={value}
                    speed={speed}
                  />
                );
              })}
            </>
          ) : (
            <Result
              status="warning"
              title="代码正常运行，但是信息板是空的，所以啥也没有"
            />
          )
        ) : (
          <Form form={form1} {...layout}>
            <Form.Item
              name="playSpeed"
              label="动画播放速度"
              rules={[
                {
                  required: true,
                  message: "动画播放速度不能为空",
                },
              ]}
            >
              <Slider min={300} max={3000} step={50} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type={"primary"} onClick={saveTextSetting}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      <Card title="图片滚动" style={{ margin: "10px" }}>
        {!imageSetting ? (
          messages.length ? (
            <Carousel autoplay>
              {messages.map((message) => {
                return (
                  <div>
                    <div style={contentStyle}>{message}</div>
                  </div>
                );
              })}
            </Carousel>
          ) : (
            <Result
              status="warning"
              title="代码正常运行，但是信息板是空的，所以啥也没有"
            />
          )
        ) : (
          <Form form={form2} {...layout}>
            <Form.Item
              name="playSpeed"
              label="动画播放速度"
              rules={[
                {
                  required: true,
                  message: "动画播放速度不能为空",
                },
              ]}
            >
              <Slider min={1} max={10} />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type={"primary"} onClick={saveImageSetting}>
                保存设置
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>

      {/*<Card title="信息板列表" style={{ margin: "15px" }}>*/}
      {/*  <InformationBoardManage setMessages={setMessages} />*/}
      {/*</Card>*/}
    </React.Fragment>
  );
}

export default InformationBoard;

const contentStyle = {
  height: "300px",
  color: "#fff",
  lineHeight: "100px",
  textAlign: "center",
  background: "#5084e3",
  fontSize: "100px",
  paddingTop: "80px",
};
