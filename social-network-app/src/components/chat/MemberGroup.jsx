import React from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { baseUrl, userImage } from "../../App";

function MemberGroup({ users }) {
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  return (
    <>
      <a
        onClick={handleShow}
        className="dropdown-item"
        role="button"
        style={{ fontWeight: "500" }}
      >
        Members
      </a>
      <Modal
        dialogClassName="modal-width"
        show={show}
        centered
        onHide={handleClose}
        style={{ widows: "inherit" }}
      >
        <div className="d-flex border-bottom py-2 position-relative">
          <h6 className="modal-title mx-auto">Members of the group</h6>
          <button
            type="button"
            className="btn-close position-absolute top-5"
            style={{ right: "8px" }}
            onClick={handleClose}
          ></button>
        </div>
        <div className="new-message-footer">
          {users.length > 0 &&
            users.map((u) => (
              <Link className="text-dark" to={`/u/${u.id}`} key={u.id}>
                <div className="d-flex member-group-chat p-1 py-2" >
                  <img
                    src={
                      u.avatar
                        ? `${baseUrl}${u.avatar}`
                        : `${userImage}`
                    }
                    className="author-img-search ms-3"
                  />
                  <div className="px-2 d-flex flex-column">
                    <span className="name-user-modal mt-2">{u.name}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
        <div className="border-top" style={{height:"25px"}}></div>
      </Modal>
    </>
  );
}

export default MemberGroup;
