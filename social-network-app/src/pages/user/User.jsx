import React from 'react'
import { useParams } from 'react-router-dom'
import { useGetUserByIdQuery } from '../../app/services/user.service';
import { useGetPostByUserIdQuery } from '../../app/services/posts.service';
import Post from '../../components/post/Post';

function User() {
    const { userId } = useParams();
    const { data: user, isLoading: isLoadingUser } = useGetUserByIdQuery(userId);
    const { data: posts, isLoading: isLoadingPosts} = useGetPostByUserIdQuery(userId);

    if (isLoadingUser || isLoadingPosts) {
        return (
            <div className="container">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )
    }
  return (
    <>
    <div className="container d-flex">
      <div className="profile-container">
        <div className="profile d-flex mt-5">
          <div className="profile-image d-flex justify-content-center">
            <img
              src={user.avatar ? `http://localhost:8080${user.avatar}` : "../../../public/user.jpg"}
              alt=""
            />
          </div>
          <div classNameName="profile-right d-flex flex-column ms-5">
            <div className="profile-user-settings d-flex ms-5">
              <h1 className="profile-user-name h4">{user.name}</h1>

              <a className="btn ms-5 btn-edit-profile" href="/edit-profile">
                Follow
              </a>
              <a className="btn ms-4 btn-edit-profile" href="/edit-profile">
                Message
              </a>
            </div>

            <div className="profile-stats">
              <ul className="d-flex mt-4">
                <li className="mx-3">
                  <b>164</b> post
                </li>
                <li className="mx-3">
                  <a role="button">
                    <b>188</b> followers
                  </a>
                </li>
                <li className="mx-3">
                  <a role="button">
                    <b>218</b> following
                  </a>
                </li>
              </ul>
            </div>
            <div className="profile-bio ps-5 mt-4">
              <p>{user.biography}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="container d-flex mt-4">
      <p className="me-auto ms-auto">
        <i className="fa-solid fa-venus-mars"></i> {user.gender}
      </p>
      <p className="me-auto">
        <i className="fa fa-envelope me-2"></i> {user.email}
      </p>
      <p className="me-auto">
        <i className="fa fa-phone me-2"></i> {user.phone}
      </p>
      <p className="me-auto">
        <i className="fa fa-map-marker-alt me-2"></i> {user.address}
      </p>
    </div>
    {/* post */}
    <div className="border-top ">
    <section className="main-content">
        <div className="container">
          <br />

          <div className="row">
            {posts.map((p) => (
                <Post p={p} key={p.id}/>
            ))}

          </div>
        </div>
      </section>
      
    </div>
  </>
  )
}

export default User