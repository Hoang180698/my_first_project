import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useDeleteNotificationByIdMutation } from "../../app/services/notification.service";
import { toast } from "react-toastify";
import { baseUrl, userImage } from "../../App";

function NotifyBox({ n, deleteNotify }) {
  
  const [showModal, setShowModal] = useState(false);

  const [deleteNotification] = useDeleteNotificationByIdMutation();

  const handleDeleteNotification = (id) => {
    deleteNotify(id);
    deleteNotification(id)
        .unwrap().then(() => {
          toast.success("Removed")
        }).catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
  }

  return (
    <>
      <Modal show={showModal} centered size="sm">
        <div className="modal-content">
          <div className="">
            <a
              type="button"
              className="d-block btn avatar-modal text-danger"
              onClick={() => handleDeleteNotification(n.id)}
            >
              Remove
            </a>
          </div>
          <div className="border-top">
            <a
              type="button"
              className="d-block btn"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </a>
          </div>
        </div>
      </Modal>

      <div className="notification-list text-dark position-relative">
        <a className="text-dark notify-activiti" role="button" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-ellipsis"></i>
        </a>
        <div className="notification-list_content">
          <Link to={`/u/${n.sender.id}`} className="notification-list_img">
            <img
              src={
                n.sender.avatar
                  ? `${baseUrl}${n.sender.avatar}`
                  : `${userImage}`
              }
            />
          </Link>
          <div className="notification-list_detail d-grid">
            <div>
              <Link className="text-dark fw-bold" to={`/u/${n.sender.id}`}>{n.sender.name}</Link>
              {n.type === "follow" && (
                <p className="mt-2">Started following you</p>
              )}
              {n.type !== "follow" && (
                <Link to={`/p/${n.post.id}${n.comment? "/" + n.comment.id : ""}${n.replyComment? "/" + n.replyComment.id : ""}`} className="ms-2">
                  <span className="text-muted">{n.content}</span>
                </Link>
              )}
                {n.type !== "follow" && (
               <Link to={`/p/${n.post.id}${n.comment? "/" + n.comment.id : ""}${n.replyComment? "/" + n.replyComment.id : ""}`}>
                 <p
                className="text-muted notfy-content text-truncate"
                style={{ width: "750px" }}
              >   
                         {(n.comment && !n.replyComment)? `${n.comment.content}`: ""}
                         {n.replyComment? `${n.replyComment.content}`: ""}
                    
              </p>
               </Link>           
            )}
            </div>
      
            <p className="text-muted">
              <small
                role="button"
                data-bs-toggle="tooltip"
                data-placement="bottom"
                title={formatDateTime(n.createdAt)}
              >
                {formatDate(n.createdAt)}
              </small>
            </p>
          </div>
        </div>
        <div className="notification-list_feature-img my-auto">
          {n.type !== "follow" && n.post.imageUrls.length > 0 && (
            <Link to={`/p/${n.post.id}${n.comment? "/" + n.comment.id : ""}${n.replyComment? "/" + n.replyComment.id : ""}`}>
             <img
              src={`${baseUrl}${n.post.imageUrls[0]}`}
              alt="post img"
            /></Link>      
          )}
        </div>
      </div>
    </>
  );
}

export default NotifyBox;
