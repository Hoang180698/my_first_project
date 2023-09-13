import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

function ChangeGroupName({ conversation, stompClient }) {
  const { token } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  const handleClose = () => {
    setShow(false);
    setLoadingButton(false);
    setName(conversation.name);
  };
  const handleShow = () => setShow(true);
  const [name, setName] = useState(conversation.name);

  useEffect(() => {
    setName(conversation.name);
  },[conversation.name])

  const handleNamedGroupChat = () => {
    const newName = name;
    setLoadingButton(true);
    stompClient.send(
      "/app/message/named/" + conversation.id,
      { Authorization: `Bearer ${token}` },
      JSON.stringify({ name: name})
    );
    setTimeout(() => {
      handleClose();
      setName(newName);
    }, 1000);
  }

  const handleNamedGroupChatOther = (e) => {
      if (e.key === "Enter") {
        handleNamedGroupChat();
    };
  }

  return (
    <>
      <a onClick={handleShow} className="dropdown-item" role="button"  style={{fontWeight:"500"}}>
        Change group name
      </a>

      <Modal dialogClassName="modal-width" show={show} centered onHide={handleClose} style={{widows:"inherit"}}>
        <div className="d-flex border-bottom py-2 position-relative">
          <h6 className="modal-title mx-auto">Change group name</h6>
          <button
            type="button"
            className="btn-close position-absolute top-5"
            style={{right:"8px"}}
            onClick={handleClose}
          ></button>
        </div>
        <div className="my-2 px-3">
          <span style={{ fontSize: "16px", fontWeight: "350", fontFamily:'sans-serif'}}>
            Changing the name of a group chat changes it for everyone.
          </span>
        </div>

        <div className="d-flex align-items-center px-2 mt-2 mb-2">
          <div className="form-control">
          <input
            type="text"
            placeholder="Add a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => handleNamedGroupChatOther(e)}
            maxLength={50}
          />
          </div> 
        </div>
        <hr className="mb-2" />
        <div className="d-grid gap-2 mx-2 my-2">
          <button type="button" className="btn btn-primary d-inline" disabled={name === conversation.name} onClick={handleNamedGroupChat}>
            {(loadingButton && (
              <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
            )) ||
              "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}

export default ChangeGroupName;
