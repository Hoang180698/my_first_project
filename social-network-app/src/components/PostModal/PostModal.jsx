import React from "react";
import TextareaAutosize from "react-textarea-autosize";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import "./PostModal.css";
import { useSelector } from "react-redux";
import {
  useAddCommentMutation,
  useGetCommentByPostIdQuery,
} from "../../app/services/comment.service";
import {
  useDeletePostMutation,
  useDislikePostMutation,
  useGetPostByIdQuery,
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
} from "../../app/services/posts.service";
import { useState } from "react";
import { useRef } from "react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import CommentBox from "../commentBox/CommentBox";
import EmojiPicker from "emoji-picker-react";
import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Liker from "../liker/Liker";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

function PostModal({ postId }) {
  const { auth } = useSelector((state) => state.auth);

  const { data: post, isLoading: isLoadingPost } = useGetPostByIdQuery(postId);
  const { data: comments, isLoading: isLoadingComments } =
    useGetCommentByPostIdQuery(postId);

  const [showMore, setShowMore] = useState(false);
  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const textareaRef = useRef(null);

  const [showLikerModal, setShowLikerModal] = useState(false);

  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [savePost] = useSavePostMutation();
  const [unSavePost] = useUnSavePostMutation();

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

  const handleDeletePost = (id) => {
    let isConfirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (isConfirm) {
      deletePost(id)
        .unwrap()
        .then(() => toast.success("You delete the post!"))
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  };

  const handeleSavePost = (saved, postId) => {
    if(saved) {
      unSavePost(postId).unwrap()
        .then()
        .catch((err) =>{
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      savePost(postId).unwrap()
        .then()
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  };

  const handleLikePost = (liked, postId) => {
    if (liked) {
      dislikePost(postId)
        .unwrap()
        .then(() => {
          //   alert("dislike");
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(first)(err);
        })
    } else {
      likePost(postId)
        .unwrap()
        .then(() => {
          //   alert("liked");
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  };

  const handleAddComment = () => {
    if (text.length > 0) {
      const newData = { content: text }
      addComment({ postId, data: newData})
        .unwrap()
        .then(() => {
          setText("");
        })
        .catch((err) => {
          toast.error("Couldn't post comment.");
          console.log(err);
        });
    }
  };

  const handleAddCommentOther = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddComment();
    }
  };

  if (isLoadingPost || isLoadingComments) {
    return (
      <div className="container">
        <div className="text-center m-5">
          <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {showLikerModal && (
        <Modal centered show={showLikerModal}>
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
      <div
        className={
          post.post.imageUrls.length > 0
            ? "pmd-content d-flex flex-column"
            : "d-flex flex-column pmd-content-noimg"
        }
      >
        <div className="header-pmd-content border-bottom mt-2">
          <div className="mt-3 ms-3 border-bottom ">
            <div className="d-flex">
              <div className="me-2">
                <a href={`/u/${post.userId}`} className="text-dark">
                  <img
                    src={
                      post.userAvatar
                        ? `http://localhost:8080${post.userAvatar}`
                        : "../../../public/user.jpg"
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
                <p role="button" className="mb-0 text-muted" style={{ fontSize: "14px" }} data-bs-toggle="tooltip" data-placement="bottom" title={formatDateTime(post.post.createdAt)}>
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
                  <i class="fa-solid fa-ellipsis"></i>
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-lg-end"
                  aria-labelledby="dropdownMenu2"
                >
                  <Link to={`/p/${post.post.id}`} className="dropdown-item text-dark">
                  Go to Post
                </Link>
                  {post.userId === auth.id && (
                    <>
                      {/* <a className="dropdown-item text-dark" role="button">
                        <i className="fa fa-pencil me-1"></i>Edit
                      </a> */}
                      <a
                        className="dropdown-item text-danger"
                        role="button"
                        onClick={() => handleDeletePost(post.post.id)}
                      >
                        <i className="fa fa-trash me-1"></i>Delete
                      </a>
                    </>
                  )}
                  <a role="button" className="dropdown-item text-danger">
                    Repost
                  </a>
                </ul>
              </div>
            </div>
            <div className="ms-1 pe-2 content-post-modal">
            {post.post.content.length > 250 && (
              <pre> {showMore ? post.post.content : `${post.post.content.substring(0, 240)}...`}
              <b role="button" onClick={() => setShowMore(!showMore)}>{showMore ? "\nShow less" : " Show more"}</b></pre>
            )}
            {post.post.content.length <= 250 && <pre>{post.post.content}</pre>}  
            </div>
          </div>

          <div class="comment-pmd ms-3 mt-2 me-3">
            {comments.length === 0 && (
              <>
                <h4 className="text-center mt-5">No comments yet.</h4>
                <p className="text-center ">Start the conversation.</p>
              </>
            )}
            <CommentBox comments={comments} />
          </div>
        </div>
        <div className="border footer-pmd-content d-flex flex-column">
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
              <a role="button" onClick={() => handeleSavePost(post.saved ,post.post.id)} className="text-dark interact">
                <span>
                  <i className={post.saved ? "fa-solid fa-bookmark text-warning" : "fa-regular fa-bookmark"}></i>
                </span>
              </a>
            </div>
            <div className="mb-0 d-flex count-interact">
              <span
                role="button"
                className="text-dark"
                onClick={() => setShowLikerModal(true)}
              >
                {post.post.likeCount} likes
              </span>
              <span className="text-dark ms-auto">
                {comments.length} comments
              </span>
            </div>
          </div>

          <div className="input-group form-comment form-control">
            <a
              role="button"
              className="emoji-icon"
              onClick={() => setShowPicker(true)}
              ref={emojiButtonRef}
            >
              <i class="fa-sharp fa-regular fa-face-smile"></i>
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
               {text.length > 100 && 
                <span className={text.length > 239 ? "text-danger ms-2 mt-2" : "ms-2 mt-2"} style={{fontSize: "11px"}}>{`${text.length}/240`}</span>  
               } 
                  
            </div>    
          </div>
        </div>
      </div>
    </>
  );
}

export default PostModal;
