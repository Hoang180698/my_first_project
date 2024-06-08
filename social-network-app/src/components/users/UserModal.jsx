import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  useFollowhUserMutation,
  useUnfollowhUserMutation,
} from "../../app/services/user.service";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { baseUrl, userImage } from "../../App";

function UserModal({ u, follow, unfollow }) {
  const { auth } = useSelector((state) => state.auth);

  const [showModal, setShoModal] = useState(false);
  const [followUser] = useFollowhUserMutation();
  const [unfollowUser] = useUnfollowhUserMutation();

  const [loadingButton, setLoadingButton] = useState(false);

  const handleFollow = (id) => {
    setLoadingButton(true);
    followUser(id)
      .unwrap()
      .then(() => {
        follow(id);
        setTimeout(() => {
          setLoadingButton(false);
        }, 500);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        setTimeout(() => {
          setLoadingButton(false);
        }, 500);
        console.log(err);
      });
  };
  
  const handleUnfollow = (id) => {
    setLoadingButton(true);
    unfollowUser(id)
      .unwrap()
      .then(() => {
        setShoModal(false);
        unfollow(id);
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        setTimeout(() => {
          setLoadingButton(false);
        }, 1000);
        console.log(err);
        setShoModal(false);
      });
  };
  if (u.id === auth.id) {
    return (
      <>
        <div className="d-flex mt-3">
          <div className="me-2">
            <Link to={"/profile/"} className="text-dark d-flex">
              <img
                src={
                  u.avatar
                    ? `${baseUrl}${u.avatar}`
                    : `${userImage}`
                }
                alt="User"
                className="author-img-search"
              />
              <p className="ms-3 mt-3 name-user-modal">{u.name}</p>
            </Link>
          </div>
          <div className="me-1 ms-auto mt-2 px-3 pt-1">
            <p className="me-2">you</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="d-flex mt-3">
        {u.followed && (
          <Modal centered show={showModal} size="sm">
            <div className="modal-content">
              <div className="modal-header d-flex justify-content-center flex-column">
                <div className="author-modal">
                  <img
                    src={
                      u.avatar
                        ? `${baseUrl}${u.avatar}`
                        : `${userImage}`
                    }
                    alt="User"
                    className="author-img-modal"
                  />
                </div>
                <p className="modal-title text-center mt-3 unfollow-question">
                  Unfollow {u.name}?
                </p>
              </div>
              <div className="">
                <a
                  type="button"
                  className="d-block btn avatar-modal text-danger"
                  onClick={() => handleUnfollow(u.id)}
                >
                  Unfollow
                </a>
              </div>
              <div className="border-top">
                <a
                  type="button"
                  className="d-block btn"
                  onClick={() => setShoModal(false)}
                >
                  Cancel
                </a>
              </div>
            </div>
          </Modal>
        )}

        <div className="me-2">
          <a href={`/u/${u.id}`} className="text-dark d-flex">
            <img
              src={
                u.avatar
                  ? `${baseUrl}${u.avatar}`
                  : `${userImage}`
              }
              alt="User"
              className="author-img-search"
            />
            <p className="ms-3 mt-3 name-user-modal">{u.name}</p>
          </a>
        </div>
        <div className="me-1 ms-auto mt-2">
          {!u.followed && (
            <button
              role="button"
              className="btn ms-5 btn-primary"
              onClick={() => handleFollow(u.id)}
              disabled={loadingButton}
            >
              {loadingButton && (
                <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
              )}
              {!loadingButton && "follow"}
            </button>
          )}
          {u.followed && (
            <button
              role="button"
              className="btn ms-5 btn-edit-profile"
              onClick={() => setShoModal(true)}
              disabled={loadingButton}
            >
              {loadingButton && (
                <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
              )}
              {!loadingButton && "following"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
export default UserModal;
