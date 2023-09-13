import React from "react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useSelector } from "react-redux";
import { useDeleteCommentMutation } from "../../app/services/comment.service";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function CommentBox({ comments }) {
  const { auth } = useSelector((state) => state.auth);
  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteComment = (id) => {
    deleteComment(id)
      .unwrap()
      .then(() => {
        toast.success("Removed");
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
      });
  };

  return (
    <>
      <div className="comment-view-box">
        {comments.length > 0 &&
          comments.map((c) => (
            <div className="d-flex mb-2 comment-box" key={c.id}>
              <div className="comment-box-content">
                <h6 className="mb-0">
                  <Link to={`/u/${c.userId}`} className="text-dark ">
                    <img
                      src={
                        c.userAvatar
                          ? `http://localhost:8080${c.userAvatar}`
                          : "../../../public/user.jpg"
                      }
                      alt="User img"
                      className="author-img author-img--small me-2"
                    />
                    {c.userName}
                  </Link>{" "}
                  {/* <small
                    className="text-muted"
                    role="button"
                    data-bs-toggle="tooltip"
                    data-placement="bottom"
                    title={formatDateTime(c.createdAt)}
                  >
                    {formatDate(c.createdAt)}
                  </small> */}
                </h6>
                <p className="mb-0">{c.content}</p>

                <div className="d-flex ms-4">
                  <span className="text-dark ms-3 me-2 interact-comment">
                    <small
                      style={{fontSize:"12px"}}
                      className="text-muted"
                      role="button"
                      data-bs-toggle="tooltip"
                      data-placement="bottom"
                      title={formatDateTime(c.createdAt)}
                    >
                      {formatDate(c.createdAt)}
                    </small>
                  </span>
                  {/* <a href="#!" className="text-dark me-2 interact-comment me-4">
                    <span>
                      <i className="fa-regular fa-heart"></i>
                    </span>
                  </a> */}
                  <a href="#!" className="text-dark ms-3 me-2 interact-comment">
                    <span>Reply</span>
                  </a>
                </div>
              </div>
              <div className="post-block__user-options dropdown ms-auto mt-2">
                <a
                  className="nav-link comment-activiti"
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
                  {c.userId === auth.id && (
                    <>
                      <a
                        role="button" className="dropdown-item text-danger" style={{fontWeight:"bold"}}
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        <i className="fa-solid fa-flag"></i> Delete
                      </a>
                    </>
                  ) ||  <a className="dropdown-item text-danger" style={{fontWeight:"bold"}}><i className="fa-solid fa-flag"></i> Repost</a>}
                </ul>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default CommentBox;
