import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import "./PostModal.css";
import { useSelector } from "react-redux";
import { useAddCommentMutation } from "../../app/services/comment.service";
import { useState } from "react";
import { useRef } from "react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Liker from "../liker/Liker";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Comments from "../comment/Comments";
import { baseUrl, userImage } from "../../App";

function PostModal({
  post,
  likePost,
  savePost,
  deletePost,
  commentCount,
  setCommentCount,
}) {
  const { auth } = useSelector((state) => state.auth);
  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const textareaRef = useRef(null);
  const [showLikerModal, setShowLikerModal] = useState(false);
  const [newComment, setNewComment] = useState(null);

  const commentRef = useRef(null);
  const contentRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [showDeletePost, setShowdeletePost] = useState(false);

  const handleClose = () => {
    setShowdeletePost(false);
  };

  const [addComment] = useAddCommentMutation();
  const [addCommentLoading, setAddCommentLoading] = useState(false);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);
    if (commentRef.current) {
      observer.observe(commentRef.current);
    }
    return () => {
      if (commentRef.current) {
        observer.unobserve(commentRef.current);
      }
    };
  }, [commentRef, options]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const onEmojiClick = (e) => {
    setText((prevInput) => prevInput + e.emoji);
  };

  const handleFocusInput = () => {
    textareaRef.current.focus();
  };
  const handleDeletePost = () => {
    deletePost(post.post.id);
    setShowdeletePost(false);
  };

  const handeleSavePost = (saved, postId) => {
    savePost(saved, postId);
  };

  const handleLikePost = (liked, postId) => {
    likePost(postId, liked);
  };
  const handleAddComment = () => {
    if (text.length > 0) {
      setAddCommentLoading(true);
      const newData = { content: text };
      addComment({ postId: post.post.id, data: newData })
        .unwrap()
        .then((data) => {
          setText("");
          setCommentCount(1);
          setNewComment(data);
          // commentRef.current.scrollIntoView({ block: 'center', inline: 'start' });  
          if(!isVisible) {
            contentRef.current.scrollTo({ top: (commentRef.current.offsetTop - 120), behavior: 'smooth'});
          }
        })
        .catch((err) => {
          toast.error("Couldn't post comment.");
          console.log(err);
        })
        .finally(() => {
          setAddCommentLoading(false);
        });
    }
  };

  const handleAddCommentOther = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <>
      {showLikerModal && (
        <Modal centered show={showLikerModal} dialogClassName="modal-width">
          <div className="modal-content px-2">
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Likes</h6>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowLikerModal(false)}
              ></button>
            </div>
            <Liker postId={post.post.id} />
          </div>
        </Modal>
      )}
      {post.post.imageUrls.length > 0 && (
        <div className="postmodal-img">
          <ImageSlider data={post.post.imageUrls} />
        </div>
      )}
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
          onClick={handleDeletePost}
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
      <div
        className={
          post.post.imageUrls.length > 0
            ? "pmd-content d-flex flex-column position-relative"
            : "d-flex flex-column pmd-content-noimg position-relative"
        }
      >
        <div className="header-pmd-content border-bottom mt-2" ref={contentRef}>
          <div className="mt-3 ms-3 border-bottom ">
            <div className="d-flex">
              <div className="me-2">
                <a href={`/u/${post.userId}`} className="text-dark">
                  <img
                    src={
                      post.userAvatar
                        ? `${baseUrl}${post.userAvatar}`
                        : `${userImage}`
                    }
                    alt="User"
                    className="author-img-pmd"
                  />
                </a>
              </div>
              <div>
                <h5 className="mb-0">
                  <a href={`/u/${post.userId}`} className="text-dark">
                    {post.userName}
                  </a>
                </h5>
                <p
                  role="button"
                  className="mb-0 text-muted"
                  style={{ fontSize: "14px" }}
                  data-bs-toggle="tooltip"
                  data-placement="bottom"
                  title={formatDateTime(post.post.createdAt)}
                >
                  {formatDate(post.post.createdAt)}
                </p>
              </div>
              <div className="post-block__user-options dropdown ms-auto me-3">
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
                    to={`/p/${post.post.id}`}
                    className="dropdown-item text-dark"
                    style={{ fontWeight: "bold" }}
                  >
                    Go to Post
                  </Link>

                  {(post.userId === auth.id && (
                    <>
                      {/* <a className="dropdown-item text-dark" role="button">
                        <i className="fa fa-pencil me-1"></i>Edit
                      </a> */}
                      <a
                        className="dropdown-item text-danger"
                        role="button"
                        style={{ fontWeight: "bold" }}
                        onClick={() => setShowdeletePost(true)}
                      >
                        <i className="fa fa-trash me-1"></i>Delete
                      </a>
                    </>
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
            <div className="ms-1 pe-2 content-post-modal">
              {post.post.content.length > 250 && (
                <pre>
                  {showMore
                    ? post.post.content
                    : `${post.post.content.substring(0, 240)}...`}
                  <b role="button" onClick={() => setShowMore(!showMore)}>
                    {showMore ? "\nShow less" : " Show more"}
                  </b>
                </pre>
              )}
              {post.post.content.length <= 250 && (
                <pre>{post.post.content}</pre>
              )}
            </div>
          </div>
          <div className="comment-pmd ms-3 mt-2 me-3">
            <div ref={commentRef}></div>
            <Comments
              postId={post?.post?.id}
              setCommentCount={setCommentCount}
              newComment={newComment}
            />
          </div>
        </div>
        <div className="footer-pmd-content d-flex flex-column">
          <div className="mx-3 mt-2">
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <a
                  role="button"
                  className={
                    post.liked
                      ? "text-danger mr-2 icon-pmd"
                      : "text-dark mr-2 icon-pmd"
                  }
                  onClick={() => handleLikePost(post.liked, post.post.id)}
                >
                  <i
                    className={
                      post.liked ? "fa fa-heart" : "fa-regular fa-heart"
                    }
                  ></i>
                </a>
                <a
                  className="text-dark ms-3 icon-pmd"
                  onClick={handleFocusInput}
                >
                  <span>
                    <i className="fa-regular fa-comment"></i>
                  </span>
                </a>
                {/* <a href="#!" className="text-dark ms-3 icon-pmd">
                  <span>
                    <i className="fa-regular fa-paper-plane"></i>
                  </span>
                </a> */}
              </div>
              <a
                role="button"
                onClick={() => handeleSavePost(post.saved, post.post.id)}
                className="text-dark interact"
              >
                <span>
                  <i
                    className={
                      post.saved
                        ? "fa-solid fa-bookmark text-warning"
                        : "fa-regular fa-bookmark"
                    }
                  ></i>
                </span>
              </a>
            </div>
            <div className="mb-0 d-flex count-interact">
              {post.post.likeCount > 0 && (
                <span
                  role="button"
                  className="text-dark"
                  onClick={() => setShowLikerModal(true)}
                >
                  {post.post.likeCount} likes
                </span>
              )}
              {commentCount > 0 && (
                <span className="text-dark ms-auto">
                  {commentCount} comments
                </span>
              )}
            </div>
          </div>

          <div
            className="input-group form-comment form-control"
            disabled={addCommentLoading}
          >
            <a
              role="button"
              className="emoji-icon"
              onClick={() => setShowPicker(true)}
              ref={emojiButtonRef}
            >
              <i className="fa-sharp fa-regular fa-face-smile"></i>
            </a>
            <TextareaAutosize
              rows="1"
              type="text"
              maxRows={2}
              className="form-control ms-1"
              placeholder="Add your comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => handleAddCommentOther(e)}
              autoFocus={true}
              ref={textareaRef}
              maxLength={240}
            />
            {showPicker && (
              <div className="emoji-picker" ref={emojiRef}>
                <EmojiPicker
                  height={400}
                  width={300}
                  onEmojiClick={onEmojiClick}
                  skinTonesDisabled={true}
                  emojiStyle="native"
                  autoFocusSearch={true}
                />
              </div>
            )}
            <div className="input-group-append d-grid">
              <button
                className="btn btn-post-comment btn-block"
                onClick={handleAddComment}
                disabled={!text}
              >
                post
                {/* <i className="fa fa-paper-plane"></i> */}
              </button>
              {text.length > 100 && (
                <span
                  className={
                    text.length > 239 ? "text-danger ms-2 mt-2" : "ms-2 mt-2"
                  }
                  style={{ fontSize: "11px" }}
                >{`${text.length}/240`}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostModal;
