import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { formatDateTime } from "../../utils/functionUtils";
import { baseUrl } from "../../App";

function ImageBox({ imageUrl, createAt }) {
  const [showImg, setShowImg] = useState(false);
  return (
    <>
      <Modal centered={true} show={showImg} onHide={() => setShowImg(false)}>
        <div className="img-chat-box d-flex justify-content-center align-items-center">
          <img src={`${baseUrl + imageUrl}`} />
        </div>
      </Modal>
      <div
        className="chat-image"
        role="button"
        onClick={() => setShowImg(true)}
        data-bs-toggle="tooltip"
        data-placement="bottom"
        title={formatDateTime(createAt)}
      >
        <img src={`${baseUrl + imageUrl}`} />
      </div>
    </>
  );
}

export default ImageBox;
