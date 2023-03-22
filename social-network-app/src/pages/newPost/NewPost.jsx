import { Button } from 'bootstrap/dist/js/bootstrap.bundle';
import React, { useState } from 'react'
import useCreatePost from './useCreatePost';

function NewPost() {
  const { offCreatePost } = useCreatePost();

  const [content, setContent] = useState("");
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
              <div className="np-icon d-flex border px-3 py-3">
              <h6 className='me-4'>Add to your post:</h6>
              <label htmlFor="photo-video" className="photo-video text-center">
              <i className="fa-solid fa-photo-film">
                </i>
              </label>
              
              </div>
              <input className="d-none" type="file" id="photo-video" />
              <div className="d-grid gap-2 mt-4">
                <button className="btn btn-success btn-block" disabled={content === ""}>Post</button>
              </div>
            </div>
          </div>
        </div>
       
    </>
  )
}

export default NewPost;