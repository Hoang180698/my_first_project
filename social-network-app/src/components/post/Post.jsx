import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import ImageSlider from "../imageSlider/ImageSlider";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import PostModal from "../PostModal/PostModal";
import Liker from "../liker/Liker";
import { useSelector } from "react-redux";
import { baseUrl, userImage } from "../../App";

function Post({ p, likePost, savePost, deletePost, }) {
  const { auth } = useSelector((state) => state.auth);
  const likerRef = useRef(null);
  const [showMore, setShowMore] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showLikerModal, setShowLikerModal] = useState(false);
  const [showDeletePost, setShowdeletePost] = useState(false);
  const [commentCount, setCommentCount] = useState(p.post.commentCount);
  const handeleSetCommentCount = (count) => {
    setCommentCount(commentCount + count);
  }
  const handleClose = () => {
    setShowdeletePost(false);
  };
  const handleOfLikerModal = () => {
    likerRef.current.removeChild(likerRef.current.children[0]);
    setShowLikerModal(false);
  };
  const handleLikePost = (postId, liked) => {
    likePost(postId, liked);
  };
  const handeleSavePost = (saved, postId) => {
    savePost(saved, postId);
  };
  const handleDeletePost = (id) => {
    setShowPostModal(false);
    setShowdeletePost(false);
    deletePost(id);
  };
  useEffect(() => {
    setCommentCount(p.post?.commentCount)
  },[p])

  return (
    <>
      <Modal
        dialogClassName="modal-width"
        show={showDeletePost}
        centered
        onHide={handleClose}
        style={{ widows: "inherit" }}
      >
        <div className="d-flex border-bottom py-2 text-center flex-column">
          <span className="mt-3" style={{ fontSize: "20px" }}>
            Delete post?
          </span>
          <span
            className="mx-auto mb-3"
            style={{ fontSize: "12px", color: "#737373", width: "70%" }}
          >
            Are you sure you want to delete this post?
          </span>
        </div>
        <div
          role="button"
          className="py-2 border-bottom text-center"
          onClick={() => handleDeletePost(p.post.id)}
        >
          <span
            style={{ color: "#ED4956", fontWeight: "bold", fontSize: "14px" }}
          >
            Delete
          </span>
        </div>

        <div role="button" className="py-2 text-center" onClick={handleClose}>
          <span style={{ fontSize: "14px" }}>Cancel</span>
        </div>
      </Modal>
      {showLikerModal && (
        <Modal centered show={true} dialogClassName="modal-width">
          <div className="modal-content px-2" ref={likerRef}>
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Likes</h6>
              <button
                type="button"
                className="btn-close"
                onClick={handleOfLikerModal}
              ></button>
            </div>
            <Liker postId={p.post.id} />
          </div>
        </Modal>
      )}
      {showPostModal && (
        <Modal
          centered
          show={showPostModal}
          size={p.post.imageUrls.length > 0 ? "xl" : "lg"}
        >
          <div className="d-flex post-modal-container">
            <a
              role="button"
              className="btn-close btn-close-white btn-close-pmd"
              onClick={() => setShowPostModal(false)}
            ></a>
            <PostModal
              post={p}
              likePost={likePost}
              savePost={savePost}
              deletePost={handleDeletePost}
              commentCount={commentCount}
              setCommentCount={handeleSetCommentCount}
            />
          </div>
        </Modal>
      )}
      <div className="col-sm-6 offset-sm-3">
        <div
          className="modal fade"
          id="popupModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="popupModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="popupModalLabel">
                  Pop-up Modal
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Đóng"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <iframe
                  id="popupIframe"
                  src=""
                  width="100%"
                  height="500"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        <div className="post-block border">
          <div className="d-flex justify-content-between">
            <div className="d-flex mb-3">
              <div className="me-2">
                <Link href={`/u/${p.userId}`} className="text-dark">
                  <img
                    src={
                      p.userAvatar
                        ? `${baseUrl}${p.userAvatar}`
                        : `${userImage}`
                    }
                    alt="User"
                    className="author-img"
                  />
                </Link>
              </div>
              <div>
                <h5 className="mb-0">
                  <a href={`/u/${p.userId}`} className="text-dark">
                    {p.userName}
                  </a>
                </h5>
                <p
                  role="button"
                  className="mb-0 text-muted time-post"
                  data-bs-toggle="tooltip"
                  data-placement="bottom"
                  title={formatDateTime(p.post.createdAt)}
                >
                  {formatDate(p.post.createdAt)}
                </p>
              </div>
            </div>

            {/* edit xoa */}

            <div className="post-block__user-options dropdown">
              <a
                className="nav-link"
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
                <Link
                  className="dropdown-item text-dark"
                  to={`/p/${p.post.id}`}
                  style={{ fontWeight: "bold" }}
                >
                  Go to post
                </Link>

                {(p.userId === auth.id && (
                  <a
                    role="button"
                    className="dropdown-item text-danger"
                    style={{ fontWeight: "bold" }}
                    onClick={() => setShowdeletePost(true)}
                  >
                    <i className="fa fa-trash me-1"></i>Delete
                  </a>
                )) || (
                  <a
                    role="button"
                    className="dropdown-item text-danger"
                    style={{ fontWeight: "bold" }}
                  >
                    <i className="fa-solid fa-flag"></i> Repost
                  </a>
                )}
              </ul>
            </div>
          </div>

          {/* content */}
          <div className="post-block__content mb-2">
            {p.post.content.length > 250 && (
              <pre>
                {" "}
                {showMore
                  ? p.post.content
                  : `${p.post.content.substring(0, 240)}...`}
                <b role="button" onClick={() => setShowMore(!showMore)}>
                  {showMore ? "\nShow less" : "Show more"}
                </b>
              </pre>
            )}
            {p.post.content.length <= 250 && <pre>{p.post.content}</pre>}
            <ImageSlider data={p.post.imageUrls} />
          </div>
          <div className="mb-3 border-top">
            <div className="d-flex justify-content-between mb-2 mt-3">
              <div className="d-flex">
                <a
                  role="button"
                  onClick={() => handleLikePost(p.post.id, p.liked)}
                  className={
                    p.liked
                      ? "text-danger mr-2 interact"
                      : "text-dark mr-2 interact"
                  }
                >
                  <span>
                    <i
                      className={
                        p.liked ? "fa fa-heart" : "fa-regular fa-heart"
                      }
                    ></i>
                  </span>
                </a>
                <a
                  className="text-dark ms-3 interact"
                  onClick={() => setShowPostModal(true)}
                >
                  <span>
                    <i className="fa-regular fa-comment"></i>
                  </span>
                </a>
                {/* <a href="#!" className="text-dark ms-3 interact">
                  <span>
                    <i className="fa-regular fa-paper-plane"></i>
                  </span>
                </a> */}
              </div>
              <a
                role="button"
                onClick={() => handeleSavePost(p.saved, p.post.id)}
                className="text-dark interact"
              >
                <span>
                  <i
                    className={
                      p.saved
                        ? "fa-solid fa-bookmark text-warning"
                        : "fa-regular fa-bookmark"
                    }
                  ></i>
                </span>
              </a>
            </div>
            <div className="mb-0 d-flex count-interact">
              {p.post?.likeCount > 0 && (
                <span
                  role="button"
                  className="text-dark"
                  onClick={() => setShowLikerModal(true)}
                >
                  {p.post.likeCount} likes
                </span>
              )}

              {commentCount > 0 && (
                <span className="text-dark ms-auto">
                  {commentCount} comments
                </span>
              )}
            </div>
          </div>
          {/* <hr /> */}
          <div className="post-block__comments">
            {/* <!-- Comment Input --> */}
            {/* <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Add your comment"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-primary"
                  type="button"
                  id="button-addon2"
                >
                  <i className="fa fa-paper-plane"></i>
                </button>
              </div>
            </div> */}
            {/* <!-- Comment content --> */}
            {/* <div className="comment-view-box mb-3">
          <div className="d-flex mb-2">
            <div>
              <h6 className="mb-1">
                <a href="#!" className="text-dark ">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3QLKE2uwuNuRA7wm5VKxwygySQAhafNN1GQ&usqp=CAU"
                    alt="User img"
                    className="author-img author-img--small me-2"
                  />
                  John doe
                </a>{" "}
                <small className="text-muted">1m</small>
              </h6>
              <p className="mb-0 ms-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing
                elit.
              </p>
              <div className="d-flex ms-5">
                <a
                  href="#!"
                  className="text-dark me-2 interact-comment"
                >
                  <span>
                    <i className="fa-regular fa-heart"></i>
                  </span>
                </a>
                <a
                  href="#!"
                  className="text-dark me-2 interact-comment"
                >
                  <span>Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div> */}
            {/* <!-- More Comments --> */}
            {/* <hr /> */}
            {/* <a href="#!" className="text-dark view-more-coment">
              View More comments{" "}
              <span className="font-weight-bold">({p.commentCount})</span>
            </a> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
