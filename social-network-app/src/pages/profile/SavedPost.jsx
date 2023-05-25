import React from 'react'
import Post from '../../components/post/Post'
import { useState } from 'react'
import { useGetAllSavedPostQuery } from '../../app/services/posts.service';

function SavedPost() {
  const { data, isLoading } = useGetAllSavedPostQuery();

  if (isLoading) {
    return (
      <dic className="container">
        <div className="text-center m-5">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </dic>
    );
  }
  if (data.length === 0) {
    return (
      <section className="main-content">
        <div className="container">
          <div className="row">
            <h1>
              <h6 className="text-center">No one is notified, and only you can see what you've saved. </h6>
            </h1>
          </div>
        </div>
      </section>
    );
  }
  return (
    <>
           <section className="main-content">
        <div className="container">
          <h1 className="text-center text-uppercase">Saved Post</h1>
          <br />
          <br />

          <div className="row">
            {data.length > 0 &&
              data.map((p) => <Post p={p} key={p.post.id} />)}
          </div>
        </div>
      </section>
    </>
  )
}

export default SavedPost