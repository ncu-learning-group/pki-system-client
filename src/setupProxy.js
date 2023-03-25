// const { createProxyMiddleware } = require("http-proxy-middleware");
//
// module.exports = function (app) {
//   const IP = "127.0.0.1";
//
//   app.use(
//     createProxyMiddleware("/rsa", {
//       target: `http://${IP}:8080/`,
//       secure: false,
//       changeOrigin: true,
//     })
//   );
// };
