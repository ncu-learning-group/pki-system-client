import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import "./assets/css/style.css";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00b96b",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
