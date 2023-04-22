import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";
import "./Profile.css";
import { useFollowhUserMutation, useUnfollowhUserMutation } from "../../app/services/user.service";
import Follower from "../../components/users/Follower";
import Following from "../../components/users/Following";
import { Modal } from "react-bootstrap";


function Profile() {
  const { auth } = useSelector((state) => state.auth);

  const [followUser] = useFollowhUserMutation();
  const [unfollowUser] = useUnfollowhUserMutation();

  const [showFollower, setShowFollower] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  
  return (
    <>
     {showFollower && (
      <Modal centered show={true}>
         <div className="modal-content px-2">
            <div className="d-flex border-bottom py-2">
              <h6 className="modal-title mx-auto">Followers</h6>
              <button type="button" className="btn-close" onClick={() => setShowFollower(false)}></button>
            </div>
            <Follower userId={auth.id}/>
          </div>
      </Modal>
    )}
    {showFollowing && (
        <Modal centered show={true}>
        <div className="modal-content px-2">
           <div className="d-flex border-bottom py-2">
             <h6 className="modal-title mx-auto">Following</h6>
             <button type="button" className="btn-close" onClick={() => setShowFollowing(false)}></button>
           </div>
           <Following userId={auth.id}/>
         </div>
     </Modal>
    )}
      <div className="container d-flex">
        <div className="profile-container">
          <div className="profile d-flex mt-5">
            <div className="profile-image d-flex justify-content-center">
              <img
                src={auth.avatar ? `http://localhost:8080${auth.avatar}` : "../../../public/user.jpg"}
                alt=""
              />
            </div>
            <div classNameName="profile-right d-flex flex-column ms-5">
              <div className="profile-user-settings d-flex ms-5">
                <h1 className="profile-user-name h4">{auth.name}</h1>

                <a className="btn mx-5 btn-edit-profile" href="/edit-profile">
                  Edit profile
                </a>
              </div>

              <div className="profile-stats">
                <ul className="d-flex mt-4">
                  <li className="mx-3">
                    <b>164</b> post
                  </li>
                  <li className="mx-3">
                    <a role="button" onClick={() => setShowFollower(true)}>
                      <b>188</b> followers
                    </a>
                  </li>
                  <li className="mx-3">
                    <a role="button" onClick={() => setShowFollowing(true)}>
                      <b>218</b> following
                    </a>
                  </li>
                </ul>
              </div>
              <div className="profile-bio ps-5 mt-4">
                <pre>{auth.biography}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container d-flex mt-4">
        <p className="me-auto ms-auto">
          <i className="fa-solid fa-venus-mars"></i> {auth.gender}
        </p>
        <p className="me-auto">
        <i class="fa-solid fa-cake-candles"></i> {auth.birthday}
        </p>
        <p className="me-auto">
          <i className="fa fa-phone me-2"></i> {auth.phone}
        </p>
        <p className="me-auto">
          <i className="fa fa-map-marker-alt me-2"></i> {auth.address}
        </p>
      </div>
      {/* post */}
      <div className="border-top ">
        <div className="d-flex mt-2 profile-link">
          <NavLink to={"/profile/"} className="ms-auto me-5"> <i className="fa-solid fa-table-cells me-1"></i>Post</NavLink>
          <NavLink to={"/profile/saved"} className="me-auto"><i className="fa-regular fa-bookmark me-1"></i>Saved</NavLink>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default Profile;
