import { JSEncrypt } from "jsencrypt";

export const encryptKey = (key, publicKey) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey); // 设置公钥
  return encrypt.encrypt(key); // 加密数据
};
