import CryptoJS from "crypto-js";
export const md5 = (message) => {
  return CryptoJS.MD5(message);
};
