import { createSlice } from "@reduxjs/toolkit";

export const keySlice = createSlice({
  name: "key",
  initialState: {
    // 非对称加密算法
    asymmetricCryptographicAlgorithm: "RSA",
    // 非对称加密密钥
    asymmetricCryptographicKey: null,

    // 对称加密算法
    symmetricEncryptionAlgorithm: "AES",
    // 对称加密密钥
    symmetricEncryptionKey: null,
    // 对称加密偏移
    symmetricEncryptionAlgorithmIV: "1234567890123456",

    // 哈希算法
    hashAlgorithm: "MD5",
  },
  reducers: {
    setAsymmetricCryptographicAlgorithm: (state, action) => {
      state.asymmetricCryptographicAlgorithm = action.payload;
    },
    setAsymmetricCryptographicKey: (state, action) => {
      state.asymmetricCryptographicKey = action.payload;
    },
    setSymmetricEncryptionAlgorithm: (state, action) => {
      state.symmetricEncryptionAlgorithm = action.payload;
    },
    setSymmetricEncryptionKey: (state, action) => {
      state.symmetricEncryptionKey = action.payload;
    },
    setSymmetricEncryptionAlgorithmIV: (state, action) => {
      state.symmetricEncryptionAlgorithmIV = action.payload;
    },
    setHashAlgorithm: (state, action) => {
      state.hashAlgorithm = action.payload;
    },
  },
});

// 为每个 case reducer 函数生成 Action creators
export const {
  setAsymmetricCryptographicAlgorithm,
  setAsymmetricCryptographicKey,
  setSymmetricEncryptionAlgorithm,
  setSymmetricEncryptionKey,
  setSymmetricEncryptionAlgorithmIV,
  setHashAlgorithm,
} = keySlice.actions;

export default keySlice.reducer;
