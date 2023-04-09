import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Carousel,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  notification,
  Row,
  Select,
  Slider,
  Statistic,
} from "antd";
import { useForm } from "antd/es/form/Form.js";
import "./index.css";
import {
  encryptContent,
  regenerateSymmetricEncryptionKey,
} from "../../../utils/aes.js";
import { post, get } from "../../../axios/index.jsx";
import { md5 } from "../../../utils/md5.js";
import { encryptKey } from "../../../utils/rsa.js";
import { SettingOutlined, SyncOutlined } from "@ant-design/icons";
import { CHANGE_SECRET_KEY, GET_PUBLIC_KEY, SEND } from "../../../axios/url.js";
import { layout, tailLayout } from "../../common/layoutStyle.js";
import { useDispatch, useSelector } from "react-redux";
import {
  setAsymmetricCryptographicAlgorithm,
  setAsymmetricCryptographicKey,
  setHashAlgorithm,
  setSymmetricEncryptionAlgorithm,
  setSymmetricEncryptionKey,
} from "../../../store/keySlice.js";

function KeyManage(props) {
  const asymmetricCryptographicAlgorithm = useSelector(
    (state) => state.key.asymmetricCryptographicAlgorithm
  );
  const asymmetricCryptographicKey = useSelector(
    (state) => state.key.asymmetricCryptographicKey
  );
  const symmetricEncryptionAlgorithm = useSelector(
    (state) => state.key.symmetricEncryptionAlgorithm
  );
  const symmetricEncryptionKey = useSelector(
    (state) => state.key.symmetricEncryptionKey
  );
  const symmetricEncryptionAlgorithmIV = useSelector(
    (state) => state.key.symmetricEncryptionAlgorithmIV
  );
  const hashAlgorithm = useSelector((state) => state.key.hashAlgorithm);
  const dispatch = useDispatch();

  const [form1] = useForm();
  const [form2] = useForm();
  const [form3] = useForm();
  const [form4] = useForm();

  const [api, contextHolder] = notification.useNotification();

  // 初始化非对称密钥和对称密钥
  useEffect(() => {
    form2.setFieldsValue({ symmetricEncryptionKey });
  }, []);

  // 要求后端重新生成RSA公钥密钥
  const regenerateAsymmetricCryptographicKey = () => {
    get(CHANGE_SECRET_KEY, {}).then((res) => {
      if (res.code === "SUCCESS") {
        api.success({
          message: `成功`,
          description: `重新生成RSA公钥密钥成功`,
        });
        dispatch(
          setAsymmetricCryptographicKey(res.data.replaceAll("\r\n", ""))
        );
        // dispatch({
        //   type: "key/setAsymmetricCryptographicKey",
        //   payload: res.data.replaceAll("\r\n", ""),
        // });
      }
    });
  };

  // 生成随机的AES密钥
  const refreshSymmetricEncryptionKey = () => {
    const newSymmetricEncryptionKey = regenerateSymmetricEncryptionKey();
    form2.setFieldsValue({
      symmetricEncryptionKey: newSymmetricEncryptionKey,
    });
  };

  // 非对称密钥直接保存，除此之外的参数需要进行表单的验证/保存
  const save = async () => {
    await form1.validateFields();
    await form2.validateFields();
    await form3.validateFields();
    dispatch(
      setAsymmetricCryptographicAlgorithm(
        form1.getFieldValue("asymmetricCryptographicAlgorithm")
      )
    );
    dispatch(
      setSymmetricEncryptionAlgorithm(
        form2.getFieldValue("symmetricEncryptionAlgorithm")
      )
    );
    dispatch(
      setSymmetricEncryptionKey(form2.getFieldValue("symmetricEncryptionKey"))
    );
    dispatch(setHashAlgorithm(form3.getFieldValue("hashAlgorithm")));
    api.success({
      message: `成功`,
      description: `保存密钥设置成功`,
    });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <Card title="密钥设置" style={{ margin: "15px" }}>
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
        >
          <Form.Item {...tailLayout} style={{ margin: "3rem 0" }}>
            <Button onClick={regenerateAsymmetricCryptographicKey}>
              重新生成公钥密钥
            </Button>
          </Form.Item>
          <Form.Item
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
              {/*<Select.Option value="DSA">DSA</Select.Option>*/}
            </Select>
          </Form.Item>
        </Form>

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
              {/*<Select.Option value="DES">DES</Select.Option>*/}
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

        <Row className={"row"}>
          <Col offset={7} span={16}>
            <Statistic title="当前数字签名算法" value={hashAlgorithm} />
          </Col>
        </Row>

        <Form {...layout} form={form3} initialValues={{ hashAlgorithm: "MD5" }}>
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
              {/*<Select.Option value="SHA">SHA</Select.Option>*/}
            </Select>
          </Form.Item>
        </Form>

        <Form {...layout} form={form4}>
          <Form.Item {...tailLayout}>
            <Button type={"primary"} onClick={save}>
              保存
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </React.Fragment>
  );
}

export default KeyManage;
