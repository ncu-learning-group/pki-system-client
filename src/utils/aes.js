import CryptoJS from "crypto-js";

// const key = CryptoJS.enc.Utf8.parse("0123456789ABHAEQ"); //十六位十六进制数作为密钥
// const iv = CryptoJS.enc.Utf8.parse("DYgjCEIMVrj2W9xN"); //十六位十六进制数作为密钥偏移量

export const encryptContent = (message, key, iv) => {
  return CryptoJS.AES.encrypt(message, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(iv),
  }).toString();
};

// 对称加密：解密文本
export const decryptContent = (message, key, iv) => {
  return CryptoJS.AES.decrypt(message, CryptoJS.enc.Utf8.parse(key), {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: CryptoJS.enc.Utf8.parse(iv),
  }).toString(CryptoJS.enc.Utf8);
};
