import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import PostModal from "../PostModal/PostModal";
var baseUrl = "http://localhost:8080";

function PostList({ post, likePost, savePost, deletePost }) {
    const [showPostModal, setShowPostModal] = useState(false);
    const handleDeletePost = (id) => {
      deletePost(id);
      setShowPostModal(false);
    }
  return (
    <>
         {showPostModal && (
        <Modal
          centered
          show={showPostModal}
          size={post.post.imageUrls.length > 0 ? "xl" : "lg"}
        >
          <div className="d-flex post-modal-container">
            <a
              role="button"
              className="btn-close btn-close-white btn-close-pmd"
              onClick={() => setShowPostModal(false)}
            ></a>
            <PostModal post={post} likePost={likePost} savePost={savePost} deletePost={handleDeletePost}/>
          </div>
        </Modal>
      )}
      <div className="mt-2 ms-2 post-list-box" role="button" onClick={() => setShowPostModal(true)}>
        {(post.post.imageUrls?.length > 0 && (
          <img
            className="list-post-img"
            src={`${baseUrl}${post.post.imageUrls[0]}`}
          ></img>
        )) || <img className="list-post-img" src="../../../public/no-image.png"></img>}
        <div className="post-list-middle">
          <div className="d-flex ms-2" style={{ color: "white" }}>
            <span style={{ fontWeight: "bold" }}>
              <i className="fa-solid fa-heart"></i> {post?.post.likeCount}
            </span>
            <span className="ms-4" style={{ fontWeight: "bold" }}>
              <i className="fa-solid fa-comment"></i> {post?.post.commentCount}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostList;
