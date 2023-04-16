import React, { Fragment } from "react";
import { Button, Modal, notification, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

function ComUpload(props) {
  const { fileList, setFileList } = props;

  const [modal, modalContextHolder] = Modal.useModal();
  const [api, notificationContextHolder] = notification.useNotification();

  // const importSubmit = () => {
  //   const formData = new FormData();
  //   const [file] = fileList;
  //
  //   if (file) {
  //     formData.append("file", file.originFileObj);
  //   }
  // };

  const beforeUpload = (file) => {
    setFileList([file]);
    return false;
  };

  const onRemove = (file) => {
    setFileList([]);
  };

  return (
    <Fragment>
      {modalContextHolder}
      <Upload
        accept={"image/png, image/jpeg"}
        fileList={fileList}
        maxCount={1}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
      >
        <Button icon={<UploadOutlined />}>选择文件</Button>
      </Upload>
      {notificationContextHolder}
    </Fragment>
  );
}

export default ComUpload;
