import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useDeleteNotificationByIdMutation } from "../../app/services/notification.service";
import { toast } from "react-toastify";

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
                  ? `http://localhost:8080${n.sender.avatar}`
                  : "../../../public/user.jpg"
              }
            />
          </Link>
          <div className="notification-list_detail">
            <div>
              <b>{n.sender.name}</b>
              {n.type === "follow" && (
                <p className="mt-2">Started following you</p>
              )}
              {n.type === "like" && (
                <Link to={`/p/${n.post.id}`} className="ms-2">
                  <span className="text-muted">Liked your post</span>
                </Link>
              )}
              {n.type === "comment" && (
                <Link to={`/p/${n.post.id}`} className="ms-2">
                  <span className="text-muted">Commented your post</span>
                </Link>
              )}
            </div>
            {n.type !== "follow" && (
               <Link to={`/p/${n.post.id}`}>
                 <p
                className="text-muted notfy-content text-truncate"
                style={{ width: "750px" }}
              >
               
                {n.type === "like"
                  ? `${n.post.content}`
                  : `${n.comment.content} || ${n.post.content}`}
              </p>
               </Link>
             
            )}
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
            <img
              src={`http://localhost:8080${n.post.imageUrls[0]}`}
              alt="post img"
            />
          )}
        </div>
      </div>
    </>
  );
}

export default NotifyBox;
