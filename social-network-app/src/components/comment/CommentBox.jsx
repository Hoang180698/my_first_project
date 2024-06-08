import React, { useEffect, useRef, useState } from "react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useSelector } from "react-redux";
import { useAddReplyCommentMutation, useDeleteCommentMutation, useDeleteReplyCommentMutation, useLazyGetReplyCommentsQuery, useLikeCommentMutation, useLikeReplyCommentMutation } from "../../app/services/comment.service";
import { Link } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { toast } from "react-toastify";
import ReplyBox from "./ReplyBox";
import EmojiPicker from "emoji-picker-react";
import Modal from "react-bootstrap/Modal";
import CommentLiker from "../liker/CommentLiker";
import { baseUrl, userImage } from "../../App";

var pageSize = 3
function CommentBox({ comment, setCommentCount, fillterComments, replyCommentFocus }) {
  const { auth } = useSelector((state) => state.auth);
  const [cmt, setCmt] = useState(comment);
  const [deleteComment] = useDeleteCommentMutation();
  const [showInput, setShowInput] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState("");
  const [replies, setReplies] = useState(replyCommentFocus ? [replyCommentFocus] : []);
  const [showDeleteCmt, setShowDeleteCmt] = useState(false);
  const [addReplyComment] = useAddReplyCommentMutation();
  const [getReplyComment] = useLazyGetReplyCommentsQuery();
  const [likeComment] = useLikeCommentMutation();
  const [replyCount, setReplyCount] = useState(comment.replyCount);
  const [likeReply] = useLikeReplyCommentMutation();
  const [deleteReplyComment] = useDeleteReplyCommentMutation();
  const [showLiker, setShowLiker] = useState(false);

  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addReplyCommentLoading, setAddReplyCommentLoading] = useState(false);

  useEffect(() => {
    if(currentPage > 0 && !isLast) {
      setLoading(true);
      getReplyComment({commentId: comment.id, page: currentPage - 1, pageSize: pageSize}).unwrap()
      .then((data) => {
         const filterData = data.content.filter((x) => {
            return !replies.some((existingItem) => existingItem.id === x.id);
          });
          setReplies((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
          setReplyCount(data.totalElements);
      }).catch((err) => {
        console.log(err);
        toast.error("Error on page load.");
      }).finally(() => {
        setLoading(false);
      });
      
    }
  },[currentPage]);

  const handleAddReplyComment = () => {
    if (text.length > 0) {
      setAddReplyCommentLoading(true);
      const newData = { content: text };
      addReplyComment({ commentId: comment.id, data: newData })
        .unwrap()
        .then((data) => {
          setText("");
          setShowInput(false);
          setReplies((pre) => [data, ...pre]);
          setCommentCount(1);     
        })
        .catch((err) => {
          toast.error("Couldn't post comment.");
          console.log(err);
        })
        .finally(() => {
          setAddReplyCommentLoading(false);
        });
    }
  }

  const handleAddReplyCommentOther = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddReplyComment();
    }
  }

  const handleDeleteReplyComment = (id) => {
    deleteReplyComment(id).unwrap()
    .then(() => {
      setReplies((pre) => pre.filter((x) => x.id !== id));
      setCommentCount(-1);
      toast.success("Removed")
    })
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    })
  }

  const handleLikeComment = () => {
    likeComment(cmt.id).unwrap()
    .then((data) => {
      setCmt(data);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    })
  }

  const handleCloseInput = () => {
    setShowInput(false);
    setText("");
  };
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
    console.log(e.emoji);
    setText((prevInput) => prevInput + e.emoji);
  };
  const handleDeleteComment = () => {
    deleteComment(comment.id)
      .unwrap()
      .then(() => {
        toast.success("Removed");
        setCommentCount(-(comment.replyCount + 1));
        fillterComments(comment.id);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
      })
      .finally(() => {
        setShowDeleteCmt(false)
      });
  };
  const handleLikeReplyComment = (id) => {
    likeReply(id).unwrap()
    .then((data) => {
      let newReplies = replies.map((x) => {
        if(x.id === id) {
          return data;
        }
        return x;
      })
      setReplies(newReplies);
    })
    .catch((err) => {
      console.log(err);
      toast.error("Something went wrong. Please try again.");
    })
  }

  return (
    <>
      {showLiker && <CommentLiker show={showLiker} onHide={() => setShowLiker(false)} commentId={comment.id}/>}
     <Modal
        dialogClassName="modal-width"
        show={showDeleteCmt}
        centered
        onHide={() => setShowDeleteCmt(false)}
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
          onClick={handleDeleteComment}
        >
          <span
            style={{ color: "#ED4956", fontWeight: "bold", fontSize: "14px" }}
          >
            Delete
          </span>
        </div>

        <div role="button" className="py-2 text-center" onClick={() => setShowDeleteCmt(false)}>
          <span style={{ fontSize: "14px" }}>Cancel</span>
        </div>
      </Modal>
      <div className="mb-2 comment-box">
        <div className="comment-box d-flex">
          <div>
            <Link to={`/u/${cmt.userId}`} className="text-dark ">
              <img
                src={
                  cmt.userAvatar
                    ? `${baseUrl}${cmt.userAvatar}`
                    : `${userImage}`
                }
                alt="User img"
                className="author-img author-img--small"
              />
            </Link>
          </div>
          <div className="d-flex flex-column px-1 flex-fill">
            <div className="d-grid" style={{ maxWidth: "90%" }}>
              <div className="d-flex">
              <Link
                to={`/u/${cmt.userId}`}
                style={{ fontSize: "12px", fontWeight: "bold", color: "black" }}
              >
                {cmt.userName}
              </Link>
              </div>          
              <span
                style={{ fontSize: "14px", maxWidth: "100%" }}
                className="mb-0"
              >
                {cmt.content}
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
                  title={formatDateTime(cmt.createdAt)}
                >
                  {formatDate(cmt.createdAt)}
                </small>
              </span>
              <a
                role="button"
                className="text-dark ms-3 me-2 interact-comment"
                onClick={() => setShowInput(true)}
              >
                <span>Reply</span>
              </a>
              <a className="text-dark ms-4 interact-comment">
                <span role="button"  onClick={handleLikeComment}>
                  <i className={cmt.liked? "fa-solid fa-heart text-danger" :"fa-regular fa-heart"}></i>
                </span>
                <small role="button" className="ms-1" style={{ fontSize: "12px" }} onClick={() => setShowLiker(true)}>
                  {cmt.likeCount}
                </small>
              </a>
            </div>
            {showInput && (
              <div className="d-flex position-relative">
                <div
                  className="form-reply-comment d-flex align-items-center"
                  style={{ width: "100%", backgroundColor: "#F5F5F5" }}
                  disabled={addReplyCommentLoading}
                >
                  <a
                    role="button"
                    className="text-dark"
                    onClick={() => setShowPicker(true)}
                    ref={emojiButtonRef}
                    style={{ fontSize: "18px" }}
                  >
                    <i className="fa-sharp fa-regular fa-face-smile"></i>
                  </a>
                  <TextareaAutosize
                    rows="1"
                    type="text"
                    maxRows={2}
                    className="ms-1"
                    placeholder="Add a reply..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => handleAddReplyCommentOther(e)}
                    ref={textareaRef}
                    maxLength={240}
                    style={{
                      border: "none",
                      fontSize: "14px",
                      backgroundColor: "#F5F5F5",
                      width: "100%",
                    }}
                  />
                  {showPicker && (
                    <div className="emoji-picker-reply" ref={emojiRef}>
                      <EmojiPicker
                        height={300}
                        width={300}
                        searchDisabled={true}
                        skinTonesDisabled={true}
                        emojiStyle="native"
                        onEmojiClick={onEmojiClick}
                      />
                    </div>
                  )}
                </div>
                <div className="d-flex">
                  <div>
                    <button
                      className="btn btn-post-comment btn-block"
                      onClick={handleAddReplyComment}
                      disabled={!text}
                    >
                      post
                      {/* <i className="fa fa-paper-plane"></i> */}
                    </button>
                    {text.length > 100 && (
                      <span
                        className={
                          text.length > 239
                            ? "text-danger ms-2 mt-2"
                            : "ms-2 mt-2"
                        }
                        style={{ fontSize: "11px" }}
                      >{`${text.length}/240`}</span>
                    )}
                  </div>
                  <span
                    role="button"
                    className="btn"
                    onClick={handleCloseInput}
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </span>
                </div>
              </div>
            )}
            <div>
            {replies.map((rp, index) => (
              <ReplyBox replyComment={rp} key={index} likeReplyComment={handleLikeReplyComment} deleteReplyComment={handleDeleteReplyComment}/>
            ))}
             {loading && (
            <div className="container">
              <div className="text-center m-3">
                <div className="spinner-border m-2" role="status" style={{width:"16px", height:"16px"}}>
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}
            </div>
          
          {(replyCount > replies.length && !isLast && !loading) && (  <div role="button" className="d-flex mt-2" onClick={() => setCurrentPage(currentPage + 1)}>
                <p style={{letterSpacing:"-2px", margin:"0px"}}>&#x2015;&#x2015;&#x2015;</p>
                <span style={{ fontSize: "13px" }} className="text-muted ms-2">
                  {currentPage > 0 ? `View ${replyCount - currentPage * pageSize} more` : `View replies (${comment.replyCount - replies.length})`}
                <i className="ms-2 fa-solid fa-angle-down"></i>
              </span>
            </div>)}
          
          </div>
        </div>
        <div className="post-block__user-options dropdown ms-auto mt-2 comment-activiti">
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
            {(cmt.userId === auth.id && (
              <>
                <a
                  role="button"
                  className="dropdown-item text-danger"
                  style={{ fontWeight: "bold" }}
                  onClick={() => setShowDeleteCmt(true)}
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
  );
}

export default CommentBox;
