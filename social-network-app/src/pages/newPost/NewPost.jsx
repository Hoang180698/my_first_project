import { Button } from 'bootstrap/dist/js/bootstrap.bundle';
import React, { useState } from 'react'
import useCreatePost from './useCreatePost';

function NewPost() {
  const { offCreatePost } = useCreatePost();

  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const [images, setImages] = useState([]);

  console.log(images);

  const formData = new FormData();

  const imageHandleChange = (e) => {
      // console.log(e.target.files);
      if (e.target.files) {
        // Array.from(e.target.files).map((file) => formData.append("file", file));
        // console.log(images)
        formData.append("file", e.target.files[0]);
        const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
        // console.log(fileArray);

        setSelectedImages((prevImages) => prevImages.concat(fileArray));
        Array.from(e.target.files).map((file) => URL.revokeObjectURL(file)
        )
      }
      // console.log(selectedImages);
      // console.log(e.target.files);
      console.log(formData);
  }

  const handleRemoveImage = () => {
    setSelectedImages([]); 
  }

  const handlePost = () => {
    console.log(formData);
  }
  const renderPhotos = (source) => {
    return source.map((photo) => {
      return <img src={photo} key={photo}/>
    })
  }

  return (
    <>
        <div className="np-comment" id="np-comment">
          <div className="np-comment-box">
            <div className="np-comment-header">
              <h3 className='ms-5'>Create Post</h3>
              <button onClick={offCreatePost} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="np-comment-body">
              <textarea name="" placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)}></textarea>
            </div>
            <div className="np-comment-bottom">
              {selectedImages.length > 0 && (
                 <div className='np-result'>
                 <div className='d-flex'>
                 <button onClick={handleRemoveImage} type="button" className="btn ms-auto py-0"><i className="fa-sharp fa-regular fa-circle-xmark"></i></button>
                 </div>
                 <div className='pre-images mb-1'>
                 {renderPhotos(selectedImages)}
                 </div>
               </div>
              )}
              <div className="np-icon d-flex border px-3 py-3">
              <h6 className='me-4'>Add to your post:</h6>
              <label htmlFor="photo-video" className="photo-video text-center">
              <i className="fa-solid fa-photo-film">
                </i>
              </label>
              
              </div>
              <input className="d-none" type="file" multiple id="photo-video" onChange={imageHandleChange}/>
             
              <div className="d-grid gap-2 mt-4">
                <button onClick={handlePost} className="btn btn-success btn-block" disabled={(content === "") && (selectedImages.length === 0)}>Post</button>
              </div>
            </div>
           
           
          </div>
        </div>
       
    </>
  )
}

export default NewPost;