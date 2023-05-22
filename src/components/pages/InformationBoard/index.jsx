import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Form,
  Image,
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

  const texts = useSelector((state) => state.message.texts);
  const pictures = useSelector((state) => state.message.pictures);
  const informationBoardType = useSelector(
    (state) => state.message.informationBoardType
  );
  const [speed, setSpeed] = useState(300);

  // ******************文字滚动******************************
  const [textSetting, setTextSetting] = useState(false);
  // ******************文字滚动******************************

  // ******************图片滚动******************************
  const [imageSetting, setImageSetting] = useState(false);
  // ******************图片滚动******************************

  useEffect(() => {
    const test = pictures;
    debugger;
  }, []);

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

      {informationBoardType !== "PICTURE" && (
        <Card
          title="文字滚动"
          style={{
            margin: "10px",
            height: informationBoardType !== "ALL" ? "50rem" : "25rem",
          }}
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
            texts.length ? (
              <>
                {texts.map((value, index, array) => {
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
      )}

      {informationBoardType !== "TEXT" && (
        <Card
          title="图片滚动"
          style={{
            margin: "10px",
            height: informationBoardType !== "ALL" ? "50rem" : "25rem",
          }}
        >
          {!imageSetting ? (
            pictures.length ? (
              <Carousel>
                {pictures.map((message, index) => {
                  return (
                    <div key={index}>
                      <div
                        style={{
                          color: "#fff",
                          height:
                            informationBoardType !== "ALL" ? "35rem" : "15rem",
                          lineHeight:
                            informationBoardType !== "ALL" ? "35rem" : "15rem",
                          textAlign: "center",
                          background: "#85a0d7",
                          padding: "20px 0",
                        }}
                      >
                        <Image
                          style={{ maxHeight: "30rem" }}
                          preview={false}
                          src={
                            message === "default-image.jpg"
                              ? "https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
                              : `http://localhost:8080/images/${message}`
                          }
                        />
                      </div>
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
      )}
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
