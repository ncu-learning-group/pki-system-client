import React, { useEffect } from "react";
import { decryptContent, encryptContent } from "../../utils/aes.js";

function Test(props) {
  return <div></div>;
}

export default Test;

// 生成AES密文
// const generateAESMessage = (name, message) => {
//   const content = {
//     messageContent: message,
//     messageName: name,
//   };
//   return encryptContent(
//     content,
//     symmetricEncryptionKey,
//     symmetricEncryptionAlgorithmIV
//   );
// };

// 生成MD5数据摘要
// const generateMD5Message = (message) => {
//   return md5(message);
// };

// 生成RSA数据信封
// const generateRSAMessage = (key, publicKey) => {
//   return encryptKey(key, publicKey);
// };

// 发送加密讯息
// const sendMessage = async () => {
//   await form2.validateFields();
//   await form4.validateFields();
//   const { messageName, messageContent } = form4.getFieldsValue(true);
//   const AESMessage = generateAESMessage(messageName, messageContent);
//   const MD5Message = generateMD5Message(messageContent);
//   const RSAMessage = generateRSAMessage(
//       symmetricEncryptionKey,
//       asymmetricCryptographicKey
//   );
//
//   const param = {
//     ciphertext: AESMessage, // 密文内容
//     sign: MD5Message, // 数字签名
//     symmetricKeyCiphertext: RSAMessage, // 数字信封
//   };
//
//   post(SEND, param).then((res) => {
//     if ((res.code = "SUCCESS")) {
//       api.success({
//         message: `成功`,
//         description: `消息传输成功`,
//       });
//     }
//   });
// };
