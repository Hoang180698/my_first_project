import { Button } from "bootstrap/dist/js/bootstrap.bundle";
import React, { useEffect, useRef, useState } from "react";
import {
  useCreatePostMutation
} from "../../app/services/posts.service";
import useCreatePost from "./useCreatePost";
import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";

function NewPost() {
  const { offCreatePost } = useCreatePost();

  const [content, setContent] = useState("");
  const [loadingButton, setLoadingButton] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // const [uploadMultiImage] = useUploadMultiImagesMutation();
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const [createPost] = useCreatePostMutation();
  const navigate = useNavigate();

  const onEmojiClick = (e) => {
    setContent((prevInput) => prevInput + e.emoji);
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

  const imageHandleChange = (e) => {
    // console.log(e.target.files);
    // console.log(e.target.files[0])
    const newFiles = Array.from(e.target.files);
    if (selectedFiles.length + newFiles.length > 15) {
      toast.warning("Can't post more than 15 photos");
      return;
    }
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...newFiles,
    ]);
    const fileArray = Array.from(e.target.files).map((file) => {
      return ({ url: URL.createObjectURL(file), type: file.type})
    }   
    );
    setSelectedImages((prevImages) => prevImages.concat(fileArray));
  };

  const handleRemoveImage = () => {
    setSelectedFiles([]);
    setSelectedImages([]);
  };

  const handlePost = () => {
    setLoadingButton(true);
    const formData = new FormData();
    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });
    } 
    formData.append("content", content);
    createPost(formData)
    .unwrap()
    .then(() => {
      toast.success("Create post successfully");
      setContent("");
      setSelectedFiles([]);
      setSelectedImages([]);
      offCreatePost();
      setLoadingButton(false);
      navigate("/");
    }).catch((err) => {
      toast.error("Something went wrong. Please try again.");
      console.log(err);
      setLoadingButton(false);
    });
  }
  const renderPhotos = (source) => {
    return source.map((photo) => {
      if(photo.type.includes("image")) {
        return <span key={photo.url}><img src={photo.url} key={photo.url} /> </span> 
      }
      if(photo.type.includes("video")) {
        return <span key={photo.url} className="position-relative">
          <video className="" src={photo.url} >  
          </video> 
          <i className="fa-regular fa-circle-play icon-video"></i>
        </span> 
      }   
    });
  };

  return (
    <>
      <div className="np-comment" id="np-comment">
        <div className="np-comment-box">
          <div className="np-comment-header">
            <h3 className="ms-5">Create Post</h3>
            <button
              onClick={offCreatePost}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="np-comment-body">
            <textarea
              name=""
              placeholder="What's on your mind?"
              rows="1"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
            <a
              role="button"
              className="emoji-newpost"
              onClick={() => setShowPicker(true)}
              ref={emojiButtonRef}
            >
              <i className="fa-sharp fa-regular fa-face-smile"></i>
            </a>
            {showPicker && (
              <div className="emoji-picker-np" ref={emojiRef}>
                <EmojiPicker
                  height={350}
                  width={350}
                  onEmojiClick={onEmojiClick}
                  emojiStyle="native"
                  autoFocusSearch={false}
                />
              </div>
            )}
          </div>
          <div className="np-comment-bottom">
            {selectedImages.length > 0 && (
              <div className="np-result">
                <div className="d-flex">
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="btn ms-auto py-0 np-close-button"
                  >
                    <i className="fa-sharp fa-regular fa-circle-xmark"></i>
                  </button>
                </div>
                <div className="row mb-1">
                  {renderPhotos(selectedImages)}
                </div>
              </div>
            )}
            <div className="np-icon d-flex border px-3 py-3">
              <h6 className="me-4">Add to your post:</h6>
              <label htmlFor="photo-video" className="photo-video text-center">
                <i className="fa-solid fa-photo-film"></i>
              </label>
            </div>
            <input
              className="d-none"
              type="file"
              multiple
              id="photo-video"
              accept="image/png, image/gif, image/jpeg, image/jpg, video/mp4 ,video/x-m4v ,video/*"
              onChange={imageHandleChange}
            />

            <div className="d-grid gap-2 mt-4">
              <button
                role="button"
                onClick={handlePost}
                className="btn btn-success"
                disabled={
                  (content === "" && selectedImages.length === 0) ||
                  loadingButton
                }
              >
                {(loadingButton && (
                  <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                )) ||
                  "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPost;
