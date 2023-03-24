import React, { useEffect, useState } from "react";
import KeyFrame from "./KeyFrame/KeyFrame.jsx";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Statistic,
} from "antd";
import { useForm } from "antd/es/form/Form.js";
import "./index.css";
import { encryptContent } from "../../../utils/aes.js";
import { post } from "../../../axios/index.jsx";
import { md5 } from "../../../utils/md5.js";
import { encryptKey } from "../../../utils/rsa.js";
import { SyncOutlined } from "@ant-design/icons";

const contentStyle = {
  height: "160px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  background: "#5084e3",
};

const layout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 7,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 10,
    span: 16,
  },
};

function DigitalSignature(props) {
  const [form1] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [form4] = useForm();

  const [messageApi, contextHolder] = message.useMessage();

  // 初始化rsa密钥
  // useEffect(() => {
  //   getSymmetricEncryptionKey();
  // }, []);

  // 初始化表单项
  useEffect(() => {
    refreshSymmetricEncryptionKey();
    form4.setFieldsValue({
      messageName: "default",
      messageContent: "hi",
    });
  }, []);

  // ******************非对称加密******************************
  // 非对称加密
  const [
    asymmetricCryptographicAlgorithm,
    setAsymmetricCryptographicAlgorithm,
  ] = useState("RSA");
  // 非对称加密公钥
  const [asymmetricCryptographicKey, setAsymmetricCryptographicKey] = useState(
    "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgfHtsq0LIc202965Jisl2DXPcUg73ULtrEmz1" +
      "sm3Kjr34Tkn7b7N0rPnxu6quimKCSCUEgocsVnVPsjHECBb5nUdRAXg4tGboKubh6SrwTo60E5Rd" +
      "AbNK05qHE1+dEvzxjYGUVKmX0DPzcW7YGOkQayXeq1v6oioylKPOhXW9BQIDAQAB"
  );
  // ******************非对称加密******************************

  // ******************对称加密******************************
  // 对称加密
  const [symmetricEncryptionAlgorithm, setSymmetricEncryptionAlgorithm] =
    useState("AES");
  // 对称加密密钥
  const [symmetricEncryptionKey, setSymmetricEncryptionKey] = useState("");
  // 对称加密偏移
  const [symmetricEncryptionAlgorithmIV, setSymmetricEncryptionAlgorithmIV] =
    useState("1234567890123456");
  // ******************对称加密******************************

  // ******************哈希算法******************************
  // 哈希
  const [hashAlgorithm, setHashAlgorithm] = useState("MD5");
  // ******************哈希算法******************************

  // 生成AES密文
  const generateAESMessage = (name, message) => {
    // const content = {
    //   messageContent: message,
    //   messageName: name,
    // };
    return encryptContent(
      message,
      symmetricEncryptionKey,
      symmetricEncryptionAlgorithmIV
    );
  };

  // 生成MD5数据摘要
  const generateMD5Message = (message) => {
    return md5(message);
  };

  // 生成RSA数据信封
  const generateRSAMessage = (key, publicKey) => {
    return encryptKey(key, publicKey);
  };

  const sendMessage = async () => {
    await form2.validateFields();
    await form4.validateFields();
    const { messageName, messageContent } = form4.getFieldsValue(true);
    const AESMessage = generateAESMessage(messageContent);
    const MD5Message = generateMD5Message(messageContent);
    const RSAMessage = generateRSAMessage(
      symmetricEncryptionKey,
      asymmetricCryptographicKey
    );

    const param = {
      ciphertext: AESMessage, // 密文内容
      sign: MD5Message, // 数字签名
      symmetricKeyCiphertext: RSAMessage, // 数字信封

      asymmetricCryptographicAlgorithm, // RSA
      symmetricEncryptionAlgorithm, // AES
      hashAlgorithm, // MD5
    };

    post("/rsa/send1", param).then((res) => {
      if (res.success) {
        messageApi.success("消息传输成功");
      }
    });
  };

  // 向后端请求RSA公钥
  const getAsymmetricCryptographicKey = () => {
    post("/test", {}).then((res) => {
      if (res.success) {
        setAsymmetricCryptographicKey(res.content);
      }
    });
  };

  // 要求后端重新生成RSA公钥密钥
  const regenerateAsymmetricCryptographicKey = () => {
    post("/test", {}).then((res) => {
      if (res.success) {
        messageApi.success("重新生成RSA公钥密钥成功");
      }
    });
  };

  // 重新随机生成AES密钥
  const regenerateSymmetricEncryptionKey = () => {
    const arr = []; // 整体长度为62
    const result = [];

    for (let i = 0; i < 10; i++) {
      arr.push(i.toString());
    }
    for (let j = 65; j <= 90; j++) {
      arr.push(String.fromCharCode(j));
    }
    for (let k = 97; k <= 122; k++) {
      arr.push(String.fromCharCode(k));
    }

    for (let i = 0; i < 16; i++) {
      result.push(arr[Math.floor(Math.random() * 62)]);
    }
    return result.reduce((previousValue, currentValue, currentIndex, array) => {
      return previousValue + currentValue;
    }, "");
  };

  const refreshSymmetricEncryptionKey = () => {
    const newSymmetricEncryptionKey = regenerateSymmetricEncryptionKey();
    setSymmetricEncryptionKey(newSymmetricEncryptionKey);
    form2.setFieldsValue({
      symmetricEncryptionKey: newSymmetricEncryptionKey,
    });
  };

  return (
    <React.Fragment>
      <Card title="加密算法" style={{ margin: "10px" }}>
        {/*第一项： 非对称加密算法*/}
        <Row className={"row"}>
          <Col offset={7} span={16}>
            <Statistic
              title="当前非对称加密算法"
              value={asymmetricCryptographicAlgorithm}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col offset={7} span={7}>
            <Statistic
              title="后端提供的非对称加密算法公钥"
              value={asymmetricCryptographicKey}
              formatter={(value) => {
                return <div className={"Statistic"}>{value}</div>;
              }}
            />
          </Col>
        </Row>
        <Form
          {...layout}
          form={form1}
          initialValues={{ asymmetricCryptographicAlgorithm: "RSA" }}
          onValuesChange={(changedValues, allValues) => {
            setAsymmetricCryptographicAlgorithm(
              changedValues.asymmetricCryptographicAlgorithm
            );
          }}
        >
          <Form.Item
            style={{ marginTop: "3rem" }}
            name="asymmetricCryptographicAlgorithm"
            label="非对称加密算法"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="非对称加密算法" allowClear>
              <Select.Option value="RSA">RSA</Select.Option>
              <Select.Option value="DSA">DSA</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type={"primary"}
              onClick={regenerateAsymmetricCryptographicKey}
            >
              重新生成公钥密钥
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Row className={"row"}>
          <Col offset={7} span={16}>
            <Statistic
              title="当前对称加密算法"
              value={symmetricEncryptionAlgorithm}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col offset={7} span={7}>
            <Statistic
              title="当前对称加密算法密钥"
              value={symmetricEncryptionKey}
            />
          </Col>
        </Row>

        <Form
          {...layout}
          form={form2}
          initialValues={{ symmetricEncryptionAlgorithm: "AES" }}
          onValuesChange={(changedValues, allValues) => {
            setSymmetricEncryptionAlgorithm(
              changedValues.symmetricEncryptionAlgorithm
            );
          }}
        >
          <Form.Item
            style={{ marginTop: "3rem" }}
            name="symmetricEncryptionAlgorithm"
            label="对称加密算法"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="对称加密算法" allowClear>
              <Select.Option value="AES">AES</Select.Option>
              <Select.Option value="DES">DES</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="symmetricEncryptionKey"
            label="对称密钥"
            rules={[
              {
                required: true,
              },
              {
                type: "string",
                len: 16,
              },
            ]}
          >
            <Input
              suffix={<SyncOutlined onClick={refreshSymmetricEncryptionKey} />}
            />
          </Form.Item>
        </Form>

        <Divider />

        <Row className={"row"}>
          <Col offset={7} span={16}>
            <Statistic title="当前数字签名算法" value={hashAlgorithm} />
          </Col>
        </Row>

        <Form
          {...layout}
          form={form3}
          initialValues={{ hashAlgorithm: "MD5" }}
          onValuesChange={(changedValues, allValues) => {
            setHashAlgorithm(changedValues.hashAlgorithm);
          }}
        >
          <Form.Item
            style={{ marginTop: "3rem" }}
            name="hashAlgorithm"
            label="数字签名算法"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="数字签名算法" allowClear>
              <Select.Option value="MD5">MD5</Select.Option>
              <Select.Option value="SHA">SHA</Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <Divider />

        <Form {...layout} form={form4}>
          <Form.Item
            name="messageName"
            label="消息名称"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="messageContent"
            label="消息内容"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type={"primary"} onClick={sendMessage}>
              发送加密讯息
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title="文字滚动" style={{ margin: "10px" }}>
        <KeyFrame
          key={"1"}
          id={"1"}
          content={
            "这是一段需要滚动的文本，它非常长，非常长，非常长，非常长，非常长，非常长，非常长"
          }
        />
        <KeyFrame
          key={"2"}
          id={"2"}
          content={"这是一段需要滚动的文本，它非常长，非常长"}
        />
      </Card>
      <Card title="图片滚动" style={{ margin: "10px" }}>
        <Carousel autoplay>
          <div>
            <h3 style={contentStyle}>1</h3>
          </div>
          <div>
            <h3 style={contentStyle}>2</h3>
          </div>
          <div>
            <h3 style={contentStyle}>3</h3>
          </div>
          <div>
            <h3 style={contentStyle}>4</h3>
          </div>
        </Carousel>
      </Card>
    </React.Fragment>
  );
}

export default DigitalSignature;

const insertNewlines = (str) => {
  let result = "";
  for (let i = 0; i < str.length; i += 50) {
    result += str.substr(i, 50) + "\n";
  }
  return result;
};
