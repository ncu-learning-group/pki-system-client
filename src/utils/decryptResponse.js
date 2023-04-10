import { decryptContent } from "./aes.js";

/**
 * 解密获得数据
 * @param message
 * @param asymmetricCryptographicKey
 * @param symmetricEncryptionKey
 * @param symmetricEncryptionAlgorithmIV
 */
export const decryptResponse = (
  message,
  asymmetricCryptographicKey,
  symmetricEncryptionKey,
  symmetricEncryptionAlgorithmIV
) => {
  return decryptContent(
    message,
    symmetricEncryptionKey,
    symmetricEncryptionAlgorithmIV
  );
};
