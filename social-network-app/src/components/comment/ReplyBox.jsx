import React, { useState } from "react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import ReplyCommentLiker from "../liker/ReplyCommentLiker";
import { baseUrl, userImage } from "../../App";

function ReplyBox({replyComment, likeReplyComment, deleteReplyComment}) {
    const { auth } = useSelector((state) => state.auth);
    const [showDelete, setShowDelete] = useState(false);
    const [showLiker, setShowLiker] = useState(false);
    const handleLikeReplyComment = () => {
      likeReplyComment(replyComment.id);
    }
    const handleDeleteReplyComment = () => {
      deleteReplyComment(replyComment.id);
      setShowDelete(false);
    }
   
  return (
    <>
     {showLiker && <ReplyCommentLiker show={showLiker} onHide={() => setShowLiker(false)} replyCommentId={replyComment.id}/>} 
     <Modal
        dialogClassName="modal-width"
        show={showDelete}
        centered
        onHide={() => setShowDelete(false)}
        style={{ widows: "inherit" }}
      >
        <div className="d-flex border-bottom py-2 text-center flex-column">
          <span className="mt-3" style={{ fontSize: "20px" }}>
            Delete comment?
          </span>
          <span
            className="mx-auto mb-3"
            style={{ fontSize: "12px", color: "#737373", width: "70%" }}
          >
            Are you sure you want to delete this comment?
          </span>
        </div>
        <div
          role="button"
          className="py-2 border-bottom text-center"
          onClick={handleDeleteReplyComment}
        >
          <span
            style={{ color: "#ED4956", fontWeight: "bold", fontSize: "14px" }}
          >
            Delete
          </span>
        </div>

        <div role="button" className="py-2 text-center" onClick={() => setShowDelete(false)}>
          <span style={{ fontSize: "14px" }}>Cancel</span>
        </div>
      </Modal>
        <div className="ms-1 mt-2 reply-box">
         <div className="d-flex">
          <div>
            <Link to={`/u/${replyComment.userId}`} className="text-dark ">
              <img
                src={
                  replyComment.userAvatar
                    ? `${baseUrl}${replyComment.userAvatar}`
                    : `${userImage}`
                }
                alt="User img"
                className="author-img author-img--small"
                style={{width:"26px", height:"26px"}}
              />
            </Link>
          </div>
          <div className="d-flex flex-column px-1 flex-fill">
            <div className="d-grid" style={{ maxWidth: "90%" }}>
              <div className="d-flex">      <Link
                to={`/u/${replyComment.userId}`}
                style={{ fontSize: "12px", fontWeight: "bold", color: "black" }}
              >
                {replyComment.userName}
              </Link></div>
        
              <span
                style={{ fontSize: "14px", maxWidth: "100%"}}
                className="mb-0"
              >
                {replyComment.content}
              </span>
            </div>
            <div className="d-flex">
              <span className="text-dark me-2">
                <small
                  style={{ fontSize: "12px" }}
                  className="text-muted"
                  role="button"
                  data-bs-toggle="tooltip"
                  data-placement="bottom"
                  title={formatDateTime(replyComment.createdAt)}
                >
                  {formatDate(replyComment.createdAt)}
                </small>
              </span>
              {/* <a role="button" className="text-dark ms-3 me-2 interact-comment" onClick={() => setShowInput(true)}>
                <span>Reply</span>
              </a> */}
              <a
                className="text-dark ms-4 interact-comment"        
              >
                <span role="button" onClick={handleLikeReplyComment}>
                  <i className={replyComment.liked? "fa-solid fa-heart text-danger" :"fa-regular fa-heart"}></i>
                </span>
                <small role="button" className="ms-1" style={{fontSize:"12px"}} onClick={() => setShowLiker(true)}>
                  {replyComment.likeCount}
              </small>
              </a>
            </div> 
          </div>
        </div>
        <div className="post-block__user-options dropdown ms-auto mt-2 reply-activiti">
          <a
            className="nav-link"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-ellipsis"></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-lg-end"
            aria-labelledby="dropdownMenu2"
          >
            {(replyComment.userId === auth.id && (
              <>
                <a
                  role="button"
                  className="dropdown-item text-danger"
                  style={{ fontWeight: "bold" }}
                  onClick={() => setShowDelete(true)}
                >
                  <i className="fa-solid fa-flag"></i> Delete
                </a>
              </>
            )) || (
              <a
                className="dropdown-item text-danger"
                style={{ fontWeight: "bold" }}
              >
                <i className="fa-solid fa-flag"></i> Repost
              </a>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}

export default ReplyBox