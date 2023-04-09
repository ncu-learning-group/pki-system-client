import { get } from "../axios/index.jsx";
import { GET_PUBLIC_KEY } from "../axios/url.js";
import { setAsymmetricCryptographicKey } from "../store/keySlice.js";

export const getAsymmetricCryptographicKey = (dispatch) => {
  get(GET_PUBLIC_KEY, {}).then((res) => {
    if (res.code === "SUCCESS") {
      dispatch(setAsymmetricCryptographicKey(res.data.replaceAll("\r\n", "")));
    }
  });
};
