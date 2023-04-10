import { JSEncrypt } from "jsencrypt";

export const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey); // 设置公钥
  return encrypt.encrypt(key); // 加密数据
};

export const decryptKey = (message, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey); // 设置公钥
  return encrypt.decrypt(message); // 解密数据
};
