import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import Modal from "react-bootstrap/Modal";
import {
  useDeletePostMutation,
  useLazyGetPostByIdQuery,
  useLikePostMutation,
  useSavePostMutation,
  useUnSavePostMutation,
  useUnlikePostMutation,
} from "../../app/services/posts.service";
import {
  useAddCommentMutation,
} from "../../app/services/comment.service";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import Liker from "../../components/liker/Liker";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import Comments from "../../components/comment/Comments";
import { baseUrl, userImage } from "../../App";

function PostDetail() {
  const { postId } = useParams();
  const { auth } = useSelector((state) => state.auth);

  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [getPost] = useLazyGetPostByIdQuery();
  const [loading, setLoading] = useState(false);
  const [addCommentLoading, setAddCommentLoading] = useState(false);

  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [showLikerModal, setShowLikerModal] = useState(false);
  const textareaRef = useRef(null);
  const [newComment, setNewComment] = useState(null);
  const [showDeletePost, setShowdeletePost] = useState(false);
  
  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [addComment] = useAddCommentMutation();
  const [savePost] = useSavePostMutation();
  const [unSavePost] = useUnSavePostMutation();

  const handeleSetCommentCount = (count) => {
    let newCount = post.post?.commentCount + count;
    let nPost = { ...post.post, commentCount: newCount}
    setPost({ ...post, post:nPost});
  }

  useEffect(() => {
    setLoading(true);
    getPost(postId).unwrap()
    .then((data) => {
      setPost(data);
    }).catch(() => {
      console.log(err)
      toast.error();
    })
    .finally(() => {
      setLoading(false);
    })

    return(() => {
      setPost(null);
    });
    
  },[postId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target) && !emojiButtonRef.current.contains(event.target)) {
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
  }

  const handleDeletePost = () => {
      deletePost(postId)
        .unwrap()
        .then(() => {
          toast.success("You delete the post!");
          setTimeout(() => {
            navigate("/");
            window.location.reload(false);
          }, 1000);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    
  };
  
  const handleLikePost = (liked, postId) => {
    if (liked) {
      unlikePost(postId)
        .unwrap()
        .then((res) => {
          let nPost = { ...post.post, likeCount: res.likeCount};
          let newPost = { ...post, liked:false, post: nPost };
          setPost(newPost);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      likePost(postId)
        .unwrap()
        .then((res) => {
          let nPost = { ...post.post, likeCount: res.likeCount};
          let newPost = { ...post, liked:true, post: nPost };
          setPost(newPost);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  };

  const handeleSavePost = (saved, postId) => {
    if(saved) {
      unSavePost(postId).unwrap()
        .then(() => {
          let newPost = { ...post, saved:false };
          setPost(newPost);
        })
        .catch((err) =>{
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    } else {
      savePost(postId).unwrap()
        .then(() => {
          let newPost = { ...post, saved:true};
          setPost(newPost);
        })
        .catch((err) => {
          toast.error("Something went wrong. Please try again.");
          console.log(err);
        });
    }
  }

  const handleAddComment = () => {
    if (text.length > 0) {
      setAddCommentLoading(true);
      const newData = {content: text}
      addComment({ postId, data: newData })
        .unwrap()
        .then((data) => {
          setText("");
          setNewComment(data);
          handeleSetCommentCount(1);
        })
        .catch((err) => {
          toast.error("Couldn't post comment!");
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

  if (loading) {
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

  if (!post) {
    return(
      <div className='container'>
      <h3 className='text-center mt-5'>Sorry, this page isn't available.</h3>
      <p className='text-center mt-4'>The link you followed may be broken, or the page may have been removed. Go back to Hoagram.</p>
  </div>
    )
  }

  return (
    <>
    <Helmet>
      <title>Post of {post.userName} | Hoagram</title>
    </Helmet>
    <Modal
        dialogClassName="modal-width"
        show={showDeletePost}
        centered
        onHide={() => setShowdeletePost(false)}
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

        <div role="button" className="py-2 text-center" onClick={() => setShowdeletePost(false)}>
          <span style={{ fontSize: "14px" }}>Cancel</span>
        </div>
      </Modal>
     {showLikerModal && (
        <Modal centered show={true}>
          <div className="modal-content px-2">
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Likes</h6>
              <button type="button" className="btn-close" onClick={() => setShowLikerModal(false)}></button>
            </div>
            <Liker postId={post.post.id}/>
          </div>
        </Modal>
      )}
      <div className="">
        <div className="container">
          <div className="col-sm-8 offset-sm-2 mb-2">
            <div className="post-block mt-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex mb-3">
                  <div className="me-2">
                    <Link to={`/u/${post.userId}`} className="text-dark">
                      <img
                        src={
                          post.userAvatar
                            ? `${baseUrl}${post.userAvatar}`
                            : `${userImage}`
                        }
                        alt="User"
                        className="author-img"
                      />
                    </Link>
                  </div>
                  <div>
                    <h5 className="mb-0">
                      <a href={`/u/${post.userId}`} className="text-dark">
                        {post.userName}
                      </a>
                    </h5>
                    <p className="mb-0 text-muted time-post" role="button" data-bs-toggle="tooltip" data-placement="bottom" title={formatDateTime(post.post.createdAt)}>
                      {formatDate(post.post.createdAt)}
                    </p>
                  </div>
                </div>

                {/* edit xoa */}

                <div className="post-block__user-options dropdown">
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
                    {post.userId === auth.id && (
                      <>
                        {/* <a className="dropdown-item text-dark" role="button">
                          <i className="fa fa-pencil me-1"></i>Edit
                        </a> */}
                        <a
                          className="dropdown-item text-danger"
                          role="button"
                          onClick={() => setShowdeletePost(true)}
                        >
                          <i className="fa fa-trash me-1"></i>Delete
                        </a>
                      </>
                    ) ||   <a role="button" className="dropdown-item text-danger">
                    Repost
                  </a>}
                  
                  </ul>
                </div>
              </div>

              {/* content */}
              <div className="post-block__content mb-2">
              {post.post.content.length > 300 && (
                <pre>
                  {showMore
                    ? post.post.content
                    : `${post.post.content.substring(0, 290)}...`}
                  <b role="button" onClick={() => setShowMore(!showMore)}>
                    {showMore ? "\nShow less" : " Show more"}
                  </b>
                </pre>
              ) ||<pre>{post.post.content}</pre>}
                <ImageSlider data={post.post.imageUrls} />
              </div>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2 mt-3">
                  <div className="d-flex">
                    <a
                      role="button"
                      onClick={() => handleLikePost(post.liked, post.post.id)}
                      className={
                        post.liked
                          ? "text-danger mr-2 interact"
                          : "text-dark mr-2 interact"
                      }
                    >
                      <span>
                        <i
                          className={
                            post.liked ? "fa fa-heart" : "fa-regular fa-heart"
                          }
                        ></i>
                      </span>
                    </a>
                    <a role="button" className="text-dark ms-3 interact" onClick={handleFocusInput}>
                      <span>
                        <i className="fa-regular fa-comment"></i>
                      </span>
                    </a>
                    {/* share */}
                    {/* <a href="#!" className="text-dark ms-3 interact">
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
                {post.post.likeCount > 0 && (
                 <span role="button" className="text-dark" onClick={() => setShowLikerModal(true)}>{post.post.likeCount} likes</span>
              )}
             
             {post.post.commentCount > 0 && (
               <span className="text-dark ms-auto">
               {post.post.commentCount} comments
             </span>
             )}             
                </div>
              </div>
              <hr />
              <div className="post-block__comments position-relative">
                {/* <!-- Comment Input --> */}
                <div className="input-group mb-3 form-comment form-control" disabled={addCommentLoading}>
                    <a role="button" className="emoji-icon" onClick={() => setShowPicker(true)} ref={emojiButtonRef}>
                      <i className="fa-sharp fa-regular fa-face-smile"></i>
                    </a>
                    <TextareaAutosize
                      rows="1"
                      type="text"
                      className="form-control ms-2"
                      placeholder="Add your comment"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => handleAddCommentOther(e)}
                      maxRows={4}
                      ref={textareaRef}
                      maxLength={240}
                    />
                    {showPicker && (
                      <div className="emoji-picker" ref={emojiRef}>
                         <EmojiPicker
                        height={400}
                        width={300}
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
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
                <span className={text.length > 239 ? "text-danger ms-2 mt-3" : "ms-2 mt-2"} style={{fontSize: "11px"}}>{`${text.length}/240`}</span>  
               } 
                  </div>
                </div>

                {/* <!-- Comment content --> */}
                <Comments postId={post.post.id} newComment={newComment} setCommentCount={handeleSetCommentCount}/>
                {/* <!-- More Comments --> */}
                {/* <hr />
                <a href="#!" className="text-dark view-more-coment">
                  View More comments{" "}
                  <span className="font-weight-bold">(12)</span>
                </a> */}
                <div className="mt-5"></div>
              </div>
            </div>
          </div>
          {/*  */}
        </div>
      </div>
    </>
  );
}

export default PostDetail;
