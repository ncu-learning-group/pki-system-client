import { encryptContent } from "./aes.js";
import { encryptKey } from "./rsa.js";
import { md5 } from "./md5.js";

/**
 * 将原文进行加密，生成密文、数字信封和数字签名
 * @param message
 * @param asymmetricCryptographicKey
 * @param symmetricEncryptionKey
 * @param symmetricEncryptionAlgorithmIV
 * @returns {{ciphertext, sign, symmetricKeyCiphertext: 加密数据}}
 */
export const encryptParam = (
  message,
  asymmetricCryptographicKey,
  symmetricEncryptionKey,
  symmetricEncryptionAlgorithmIV
) => {
  return {
    symmetricKeyCiphertext: encryptKey(
      symmetricEncryptionKey,
      asymmetricCryptographicKey
    ),
    ciphertext: encryptContent(
      message,
      symmetricEncryptionKey,
      symmetricEncryptionAlgorithmIV
    ),
    sign: md5(message),
  };
};
