import React, { Fragment } from "react";
import { Modal, notification, Upload } from "antd";

function ComUpload(props) {
  const { fileList, getUploadData } = props;

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  const importSubmit = () => {
    const formData = new FormData();
    const [file] = fileList;

    if (file) {
      formData.append("file", file.originFileObj);
    }

    getUploadData(formData)
      .then((res) => {
        console.log("getUploadDataRes", res);
        if (res.success) {
          api.info({
            message: "提示",
            description: "导入中,请勿关闭弹窗!",
          });

          // setStatus("active");
        } else {
          api.error({
            message: "错误",
            description: res.message || "操作失败",
          });
        }
      })
      .catch((error) => {
        api.error({
          message: "错误",
          description: "操作失败",
        });
      })
      .finally(() => {
        // setConfirmLoading(false);
      });
  };

  return (
    <Fragment>
      {modalContextHolder}
      <Upload fileList={fileList} maxCount={1} customRequest={importSubmit} />
      {notificationContextHolder}
    </Fragment>
  );
}

export default ComUpload;
