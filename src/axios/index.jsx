import axios from "axios";
import NProgress from "nprogress";
import { useNavigate } from "react-router-dom";

const config = {
  baseURL: "",
  transformRequest: [
    function (data) {
      return JSON.stringify(data);
    },
  ],
  transformResponse: [
    function (data) {
      return data;
    },
  ],
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  timeout: 20000,
  responseType: "json",
};

// request拦截器
axios.interceptors.request.use(
  (config) => {
    NProgress.configure({ showSpinner: false });
    NProgress.start();
    // 让请求头带上token
    // const token = getToken();
    // // console.log('%c[DEBUG]', 'color:blue', 'Token', getToken())
    // if (!isEmpty(token)) {
    //   config.headers["Authorization"] = "Bearer " + getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    // }
    return config;
  },
  (error) => {
    NProgress.done();

    // Do something with request error
    console.error(error); // for debug
    throw error;
  }
);

axios.interceptors.response.use(
  function (res) {
    // 相应拦截器
    NProgress.done();
    return res.data;
    // if (
    //   res.headers["content-disposition"] &&
    //   res.headers["content-disposition"].includes("attachment")
    // ) {
    //   let contentDisposition = res.headers["content-disposition"];
    //   let filename = res.headers["download-file-name"];
    //   if (!filename) {
    //     let [filenameContent = ""] = contentDisposition
    //       .split(";")
    //       .filter((item) => item.indexOf("filename") !== -1);
    //     filename = filenameContent.replace("filename=", "").replace(/"/g, "");
    //   }
    //   let contentType = res.headers["content-type"];
    //
    //   return {
    //     data: res.data,
    //     filename: filename,
    //     type: contentType,
    //   };
    // } else {
    //   return res.data;
    // }
  },
  function (error) {
    // 对响应错误做点什么
    NProgress.done();
    console.log("响应失败");

    // 认证失败：后端不认可token
    if (error && error.response) {
      let authfail = false;
      if (
        error.response.status === 500 &&
        error.response.data &&
        error.response.data.message &&
        error.response.data.message.indexOf("401") !== -1
      ) {
        authfail = true;
      } else
        authfail =
          error.response.status === 401 || error.response.status === 418;

      // 如果token失效，跳回登录界面
      if (authfail) {
        sessionStorage.removeItem("user");
        // 从cookie中删除token
        // cookie.remove("token");
        const navigate = useNavigate();
        if (
          window.location.pathname &&
          window.location.pathname.indexOf("/login") < 0
        ) {
          navigate("/Login");
        }
      }
    }
    // return Promise.reject(error);
    throw error;
  }
);

export function get(url, data) {
  return axios.get(url, { params: data }, config);
}

export function post(url, data, custConfig = {}) {
  if (custConfig.responseType === "blob") {
    config.responseType = "blob";
  } else {
    config.responseType = "json";
  }
  const comb = { ...config, ...custConfig };
  return axios.post(url, data, comb);
}
