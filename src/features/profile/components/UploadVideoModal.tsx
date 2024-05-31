import { Modal } from "antd";
import React from "react";

interface UploadVideoModalProps {}

const UploadVideoModal: React.FunctionComponent<UploadVideoModalProps> = () => {
  return (
    <Modal
      title="Change avatar"
      open={true}
      centered
      onCancel={() => {}}
      footer={null}
      maskClosable={false}
      width={600}
      destroyOnClose
    ></Modal>
  );
};

export default UploadVideoModal;
