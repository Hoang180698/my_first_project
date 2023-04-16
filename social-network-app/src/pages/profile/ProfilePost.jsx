import React from 'react'
import { useDeletePostMutation, useGetAllMyPostsQuery } from '../../app/services/posts.service';
import { formatDate } from '../../utils/functionUtils';
import ImageSlider from '../../components/imageSlider/ImageSlider'
import OwnPost from '../../components/post/OwnPost';

function ProfilePost() {
  const { data, isLoading } = useGetAllMyPostsQuery();

  if (isLoading) {
    return (
      <dic className="container">
          <div className="text-center">
    <div className="spinner-border" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
      </dic>
    
    ) 
}
  return (
    <>
            <section className="main-content">
        <div className="container">
          <h1 className="text-center text-uppercase">Your Post</h1>
          <br />
          <br />

          <div className="row">
          {data.length > 0 &&
            data.map((p) => (
              <OwnPost p={p} key={p.post.id}/>
            ))}

          </div>
        </div>
      </section>
    </>
  )
}

export default ProfilePost