export const checkKey = (
  asymmetricCryptographicKey,
  symmetricEncryptionKey
) => {
  return !!(asymmetricCryptographicKey && symmetricEncryptionKey);
};
