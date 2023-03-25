import CryptoJS from "crypto-js";

// const key = CryptoJS.enc.Utf8.parse("0123456789ABHAEQ"); //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse("DYgjCEIMVrj2W9xN"); //十六位十六进制数作为密钥偏移量

export const encryptContent = (message, key, iv) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(message),
    CryptoJS.enc.Utf8.parse(key),
    {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
      iv: CryptoJS.enc.Utf8.parse(iv),
    }
  ).toString();
};

// 对称加密：解密文本
export const decryptContent = (message, key, iv) => {
  return CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(iv),
  }).toString(CryptoJS.enc.Utf8);
};

// 重新随机生成AES密钥
export const regenerateSymmetricEncryptionKey = () => {
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
