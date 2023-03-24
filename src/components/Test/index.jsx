import React, { useEffect } from "react";
import { decryptContent, encryptContent } from "../../utils/aes.js";

function Test(props) {
  return <div></div>;
}

export default Test;

// aes 加密解密
// useEffect(() => {
//   const newContent = encryptContent(
//     "hello world",
//     "0123456789ABHAEQ",
//     "DYgjCEIMVrj2W9xN"
//   );
//   const message = decryptContent(
//     newContent,
//     "0123456789ABHAEQ",
//     "DYgjCEIMVrj2W9xN"
//   );
//
//   console.log("encryptContent", newContent);
//   console.log("decryptContent", message);
// }, []);
