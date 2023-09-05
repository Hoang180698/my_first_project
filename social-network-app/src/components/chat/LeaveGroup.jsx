import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LeaveGroup({ stompClient, conversationId }) {
  const { token } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const navigate = useNavigate();

  const handleLeaveGroup = () => {
    stompClient.send(
      "/app/message/leave/" + conversationId,
      { Authorization: `Bearer ${token}` }, null);
      handleClose();
      navigate(`/messenge`);
      window.location.reload();
  };

  return (
    <>
      <a
        onClick={handleShow}
        className="dropdown-item text-danger"
        role="button"
        style={{fontWeight:"500"}}
      >
        Leave group
      </a>

      <Modal
        dialogClassName="modal-width"
        show={show}
        centered
        onHide={handleClose}
        style={{ widows: "inherit" }}
      >
        <div className="d-flex border-bottom py-2 text-center flex-column">
          <span className="mt-3" style={{fontSize:"20px"}}>Leave chat</span>
          <span className="mx-auto mb-3" style={{ fontSize: "12px", color: "#737373", width: "70%" }}>
            You won't get messages from this group unless someone adds you back
            to the chat.
          </span>
        </div>
        <div role="button" className="py-2 border-bottom text-center" onClick={handleLeaveGroup}>
            <span style={{color:"#ED4956", fontWeight:"bold", fontSize:"14px"}}>Leave</span>
        </div >

        <div role="button" className="py-2 text-center" onClick={handleClose}>
            <span style={{fontSize:"14px"}}>Cancel</span>
        </div>
      </Modal>
    </>
  );
}

export default LeaveGroup;
