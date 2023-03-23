import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./Profile.css";

function Profile() {
  return (
    <>
      <div className="container d-flex">
        <div className="profile-container text-center">
          <div className="profile d-flex mt-5">
            <div className="profile-image">
              <img
                src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces"
                alt=""
              />
            </div>
            <div classNameName="profile-right d-grid">
              <div className="profile-user-settings d-flex px-5">
                <h1 className="profile-user-name h4">janedoe_</h1>

                <a className="btn mx-5 btn-edit-profile" href="#" role="button">
                  Edit profile
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
              <div className="profile-bio mx-5 mt-4">
                <p>
                  <span className="profile-real-name">Jane Doe</span> Lorem
                  ipsum dolor sit, amet consectetur adipisicing elit 📷✈️🏕️
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container d-flex mt-4">
        <p class="me-auto ms-auto">
          <i class="fa-solid fa-venus-mars"></i> Female
        </p>
        <p class="me-auto">
          <i class="fa fa-envelope me-2"></i> kiranacharya287@gmail.com
        </p>
        <p class="me-auto">
          <i class="fa fa-phone me-2"></i> +91 9876543215
        </p>
        <p class="me-auto">
          <i class="fa fa-map-marker-alt me-2"></i> Bangalore
        </p>
      </div>
      {/* post */}
      <div className="border-top ">
        <div className="d-flex mt-2 profile-link">
          <NavLink to={"/my-profile/"} className="ms-auto me-5"> <i class="fa-solid fa-table-cells me-1"></i>Post</NavLink>
          <NavLink to={"/my-profile/saved"} className="me-auto"><i class="fa-regular fa-bookmark me-1"></i>Saved</NavLink>
        </div>
        <Outlet />
      </div>

      <section class="main-content">
        <div class="container">
          <div class="row">
            <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
              <div class="profile-card card rounded-lg shadow p-4 p-xl-5 mb-4 text-center position-relative overflow-hidden">
                <div class="banner"></div>
                <img
                  src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces"
                  alt=""
                  class="img-circle mx-auto mb-3"
                />
                <h3 class="mb-4">Kiran Acharya</h3>
                <div class="text-start mb-4">
                  <p class="mb-2 ">
                    <i class="fa fa-envelope me-2"></i>{" "}
                    kiranacharya287@gmail.com
                  </p>
                  <p class="mb-2">
                    <i class="fa fa-phone me-2"></i> +91 9876543215
                  </p>
                  <p class="mb-2">
                    <i class="fa fa-globe me-2"></i> kiranworkspace.com
                  </p>
                  <p class="mb-2">
                    <i class="fa fa-map-marker-alt me-2"></i> Bangalore
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;