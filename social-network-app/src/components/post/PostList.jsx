import Modal from "react-bootstrap/Modal";
import React, { useState } from "react";
import PostModal from "../PostModal/PostModal";
import { baseUrl } from "../../App";
import noImg from "../../../src/assets/images/noImage.png"

function PostList({ post, likePost, savePost, deletePost, isBigSize }) {
    const [showPostModal, setShowPostModal] = useState(false);
    const handleDeletePost = (id) => {
      deletePost(id);
      setShowPostModal(false);
    }
    const [commentCount, setCommentCount] = useState(post.post.commentCount);
    const handeleSetCommentCount = (count) => {
      setCommentCount(commentCount + count);
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
            <PostModal post={post} likePost={likePost} savePost={savePost} deletePost={handleDeletePost} commentCount={commentCount}
            setCommentCount={handeleSetCommentCount}
            />
          </div>
        </Modal>
      )}
      <div style={{height: `${isBigSize? "606px" : ""}`}} className="mt-2 ms-2 post-list-box" role="button" onClick={() => setShowPostModal(true)}>
        {(post.post.imageUrls?.length > 0 && (
          <>
             {post.post.imageUrls[0].includes("api/images") && <img className="list-post-img" src={`${baseUrl}${post.post.imageUrls[0]}`}></img>} 
             {post.post.imageUrls[0].includes("api/videos") && <video className="list-post-img" src={`${baseUrl}${post.post.imageUrls[0]}`}></video>}
             {post.post.imageUrls[0].includes("res.cloudinary") && <video className="list-post-img" src={post.post.imageUrls[0]}></video>}     
          </>
         
        )) || <img className="list-post-img" src={noImg}></img>}
        <div className="post-list-middle">
          <div className="d-flex ms-2" style={{ color: "white" }}>
            <span style={{ fontWeight: "bold" }}>
              <i className="fa-solid fa-heart"></i> {post?.post.likeCount}
            </span>
            <span className="ms-4" style={{ fontWeight: "bold" }}>
              <i className="fa-solid fa-comment"></i> {commentCount}
            </span>
          </div>
        </div>
        { post.post.imageUrls[0] && !post.post.imageUrls[0]?.includes("api/images")  && 
            <div className="post-list-video-icon">
              <span style={{ fontWeight: "bold", color:"white", fontSize:"16px"}}>
              <i className="fa-solid fa-video"></i>
            </span>
            </div>
        }
      </div>
    </>
  );
}

export default PostList;
