import { encryptContent } from "./aes.js";
import { encryptKey } from "./rsa.js";
import { md5 } from "./md5.js";

export const getParam = (
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
