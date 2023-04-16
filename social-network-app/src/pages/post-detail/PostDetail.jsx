import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import ImageSlider from "../../components/imageSlider/ImageSlider";
import {
  useDeletePostMutation,
  useDislikePostMutation,
  useGetPostByIdQuery,
  useLikePostMutation,
} from "../../app/services/posts.service";
import {
  useAddCommentMutation,
  useGetCommentByPostIdQuery,
} from "../../app/services/comment.service";
import { formatDate } from "../../utils/functionUtils";
import { useSelector } from "react-redux";
import CommentBox from "../../components/commentBox/CommentBox";

function PostDetail() {
  const { postId } = useParams();
  const { auth } = useSelector((state) => state.auth);
  const { data: post, isLoading: isLoadingPost } = useGetPostByIdQuery(postId);
  const { data: comments, isLoading: isLoadingComments } =
    useGetCommentByPostIdQuery(postId);
  const [text, setText] = useState("");

  const [deletePost] = useDeletePostMutation();
  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();
  const [addComment] = useAddCommentMutation();

  const handleDeletePost = (id) => {
    let isConfirm = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (isConfirm) {
      deletePost(id)
        .unwrap()
        .then(() => alert("You delete the post!"))
        .catch((err) => {
          alert(err);
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
        .catch((err) => alert(err));
    } else {
      likePost(postId)
        .unwrap()
        .then(() => {
          //   alert("liked");
        })
        .catch((err) => {
          alert(err);
          console.log(err);
        });
    }
  };

  const handleAddComment = () => {
    if(text.length > 0) {
      addComment({ postId, content: text })
      .unwrap()
      .then(() => {
        setText("");
      })
      .catch((err) => {
        alert(err);
      });
    }
   
  };

  const handleAddCommentOther = (e) => {
      if(e.key === "Enter") {
        e.preventDefault();
        handleAddComment();
      }
  }

  if (isLoadingPost && isLoadingComments) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="">
        <div className="container">
          <div className="col-sm-8 offset-sm-2 mb-2">
            <div className="post-block mt-3">
              <div className="d-flex justify-content-between">
                <div className="d-flex mb-3">
                  <div className="me-2">
                    <a href="#" className="text-dark">
                      <img
                        src={
                          post.userAvatar
                            ? `http://localhost:8080${post.userAvatar}`
                            : "../../../public/user.jpg"
                        }
                        alt="User"
                        className="author-img"
                      />
                    </a>
                  </div>
                  <div>
                    <h5 className="mb-0">
                      <a href={`/u/${post.userId}`} className="text-dark">
                        {post.userName}
                      </a>
                    </h5>
                    <p className="mb-0 text-muted time-post">
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
                    <i class="fa-solid fa-ellipsis"></i>
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-lg-end"
                    aria-labelledby="dropdownMenu2"
                  >
                    {post.userId === auth.id && (
                      <>
                        <a className="dropdown-item text-dark" role="button" >
                          <i className="fa fa-pencil me-1"></i>Edit
                        </a>
                        <a className="dropdown-item text-danger" role="button" onClick={handleDeletePost}>
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

              {/* content */}
              <div className="post-block__content mb-2">
                <p>{post.post.content}</p>
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
                          class={
                            post.liked ? "fa fa-heart" : "fa-regular fa-heart"
                          }
                        ></i>
                      </span>
                    </a>
                    <a href="#!" className="text-dark ms-3 interact">
                      <span>
                        <i class="fa-regular fa-comment"></i>
                      </span>
                    </a>
                    <a href="#!" className="text-dark ms-3 interact">
                      <span>
                        <i class="fa-regular fa-paper-plane"></i>
                      </span>
                    </a>
                  </div>
                  <a href="#!" className="text-dark interact">
                    <span>
                      <i class="fa-regular fa-bookmark"></i>
                    </span>
                  </a>
                </div>
                <div className="mb-0 d-flex count-interact">
                  <span className="text-dark">{post.likeCount} likes</span>
                  <span className="text-dark ms-auto">
                    {comments.length} comments
                  </span>
                </div>
              </div>
              <hr />
              <div className="post-block__comments">
                {/* <!-- Comment Input --> */}
                <div className="input-group mb-3">
                  <TextareaAutosize
                    rows="1"
                    type="text"
                    className="form-control"
                    placeholder="Add your comment"
                    maxLength={"150"}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => handleAddCommentOther(e)}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-post-comment btn-block"
                      onClick={handleAddComment}
                      disabled={!text}
                    >
                      post
                      {/* <i className="fa fa-paper-plane"></i> */}
                    </button>
                  </div>
                </div>

                {/* <!-- Comment content --> */}

                  <CommentBox comments={comments}/>
                {/* <!-- More Comments --> */}
                <hr />
                <a href="#!" className="text-dark view-more-coment">
                  View More comments{" "}
                  <span className="font-weight-bold">(12)</span>
                </a>
              </div>
            </div>
          </div>

          {/*  */}
        </div>
      </section>
    </>
  );
}

export default PostDetail;
