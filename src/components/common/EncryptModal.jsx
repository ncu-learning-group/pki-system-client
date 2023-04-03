import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, notification, Skeleton, Steps } from "antd";
import { useSelector } from "react-redux";
import { checkKey } from "../../utils/checkKey.js";
import { LoadingOutlined } from "@ant-design/icons";
import { BOARD_SAVE } from "../../axios/url.js";
import { post } from "../../axios/index.jsx";

function EncryptModal(props) {
  const {
    open,
    confirmLoading,
    setOpen,
    setConfirmLoading,
    symmetricKeyCiphertext,
    ciphertext,
    sign,
    onClose,
    saveUri,
  } = props;

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

  const [step, setStep] = useState(-1);
  const [check, setCheck] = useState(false);

  const [firstStepStatus, setFirstStepStatus] = useState("wait");
  const [secondStepStatus, setSecondStepStatus] = useState("wait");
  const [thirdStepStatus, setThirdStepStatus] = useState("wait");

  const [api, notificationContextHolder] = notification.useNotification();

  useEffect(() => {
    if (open === true) {
      const newCheck = checkKey(
        asymmetricCryptographicKey,
        symmetricEncryptionKey
      );
      setCheck(newCheck);
      setFirstStepStatus("process");
      setConfirmLoading(true);
      const param = { symmetricKeyCiphertext, ciphertext, sign };

      post(saveUri, param).then(() => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            setStep(0);
            if (newCheck) {
              setFirstStepStatus("finish");
              setSecondStepStatus("process");
              resolve();
            } else {
              api.error({
                message: "失败",
                description: "未检测到密钥，请前往密钥管理进行设置",
              });
              setFirstStepStatus("error");
              setSecondStepStatus("wait");
              reject();
            }
          }, 2000);
        })
          .then(() => {
            return new Promise((resolve) => {
              setTimeout(() => {
                setSecondStepStatus("finish");
                setThirdStepStatus("process");
                setStep(1);
                resolve();
              }, 2000);
            })
              .then(() => {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    setThirdStepStatus("finish");
                    setStep(2);
                    resolve();
                  }, 2000);
                });
              })
              .finally(() => {
                setConfirmLoading(false);
              });
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      });
    } else {
      reset();
    }
  }, [open]);

  const reset = () => {
    setStep(-1);
    setCheck(false);
    setFirstStepStatus("wait");
    setSecondStepStatus("wait");
    setThirdStepStatus("wait");
  };

  const handleOk = () => {
    setOpen(false);
    setConfirmLoading(false);
    onClose();
  };

  return (
    <React.Fragment>
      <Modal
        title={"加密请求"}
        open={open}
        footer={
          <Button loading={confirmLoading} onClick={handleOk}>
            确定
          </Button>
        }
        width={800}
        // forceRender
        closable={false}
      >
        <Steps
          style={{ padding: "3rem 0" }}
          direction="vertical"
          current={step}
          items={[
            {
              title: "检查密钥",
              description:
                step >= 0 &&
                (check ? (
                  <div>
                    <h2>检查密钥完毕</h2>
                    <div>当前{asymmetricCryptographicAlgorithm}公钥为</div>
                    <div> {asymmetricCryptographicKey}</div>
                    <div>
                      当前{symmetricEncryptionAlgorithm}密钥为
                      <div>{symmetricEncryptionKey}</div>
                    </div>
                    <div>当前使用的哈希算法为</div>
                    <div>{hashAlgorithm}</div>
                  </div>
                ) : (
                  <div>
                    <h2>检查密钥完毕</h2>
                    <div>检测不到密钥</div>
                    <div>请前往密钥管理中设置密钥</div>
                  </div>
                )),
              icon: step === -1 && <LoadingOutlined />,
              status: firstStepStatus,
            },
            {
              title: "加密信息",
              description: step >= 1 && (
                <div>
                  <h2>加密信息完毕</h2>
                  <div>当前密文为</div>
                  <div>{ciphertext}</div>
                  <div>
                    当前数字信封为
                    <div> {symmetricKeyCiphertext}</div>
                  </div>
                  <div>当前数字签名为</div>
                  <div>{sign}</div>
                </div>
              ),
              icon: step === 0 && <LoadingOutlined />,
              status: secondStepStatus,
            },
            {
              title: "发送请求",
              description: step >= 2 && (
                <div>
                  <div>正在发送请求到服务器</div>
                  <div>服务器响应:成功</div>
                </div>
              ),
              icon: step === 1 && <LoadingOutlined />,
              status: thirdStepStatus,
            },
          ]}
        />
      </Modal>
      {notificationContextHolder}
    </React.Fragment>
  );
}

export default EncryptModal;
