import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import "./assets/css/style.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import store from "./store/store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
        },
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </ConfigProvider>
  </React.StrictMode>
);
