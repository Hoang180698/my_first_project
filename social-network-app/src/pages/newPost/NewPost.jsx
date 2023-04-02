import { Button } from "bootstrap/dist/js/bootstrap.bundle";
import React, { useState } from "react";
import { useUploadMultiImagesMutation } from "../../app/services/images.service";
import { useCreatePostMutation } from "../../app/services/posts.service";
import useCreatePost from "./useCreatePost";
import { useNavigate } from "react-router-dom";
function NewPost() {
  const { offCreatePost } = useCreatePost();

  const [content, setContent] = useState("");

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [uploadMultiImage] = useUploadMultiImagesMutation();

  const [createPost] = useCreatePostMutation();
  const navigate = useNavigate();

  const imageHandleChange = (e) => {
    // console.log(e.target.files);
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prevSelectedFiles) => [
      ...prevSelectedFiles,
      ...newFiles,
    ]);
    setSelectedImages;
    const fileArray = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );

    setSelectedImages((prevImages) => prevImages.concat(fileArray));
    Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
  };

  const handleRemoveImage = () => {
    setSelectedFiles([]);
    setSelectedImages([]);
  };

  const handleCreatePosst = (data) => {
    createPost(data)
      .unwrap()
      .then(() => {
        setContent("");
        setSelectedFiles([]);
        setSelectedImages([]);
        offCreatePost();
        alert("Create post successfully");
       
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((err) => {
        alert(err);
      });
  }

  const handlePost = () => {
    const urls = [];
    if (selectedFiles.length !== 0) {
      const formData = new FormData();
      selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
        uploadMultiImage(formData)
        .unwrap()
        .then((res) => {
          res.map((r) => urls.push(r.url));
          const newP = {
            content: content,
            imagesUrl: urls,
          };
         handleCreatePosst(newP);
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      const newPost = {
        content
      }
        handleCreatePosst(newPost);
    }
  
  };
  const renderPhotos = (source) => {
    return source.map((photo) => {
      return <img src={photo} key={photo} />;
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="np-comment-bottom">
            {selectedImages.length > 0 && (
              <div className="np-result">
                <div className="d-flex">
                  <button
                    onClick={handleRemoveImage}
                    type="button"
                    className="btn ms-auto py-0"
                  >
                    <i className="fa-sharp fa-regular fa-circle-xmark"></i>
                  </button>
                </div>
                <div className="pre-images mb-1">
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
              accept="image/png, image/gif, image/jpeg, image/jpg"
              onChange={imageHandleChange}
            />

            <div className="d-grid gap-2 mt-4">
              <button
                onClick={handlePost}
                className="btn btn-success btn-block"
                disabled={content === "" && selectedImages.length === 0}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewPost;
