import React from "react";
import {
  useFollowhUserMutation,
  useUnfollowhUserMutation,
} from "../../app/services/user.service";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { baseUrl, userImage } from "../../App";

function SearchBox({ u, follow, unfollow }) {
  const { auth } = useSelector((state) => state.auth);
  const [followUser] = useFollowhUserMutation();
  const [unfollowUser] = useUnfollowhUserMutation();

  const [showModal, setShoModal] = useState(false);

  const [loadingButton, setLoadingButton] = useState(false);

  const handleFollow = (id) => {
    setLoadingButton(true);
    followUser(id)
      .unwrap()
      .then(() => {
        follow(id);
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
      });
  };
  return (
    <>
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
              <div className="border-top">
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
      <div className="col-sm-6 offset-sm-3 search-user">
        <div className="search-box border">
          <div className="d-flex">
            <Link
              to={u.id !== auth.id ? `/u/${u.id}` : "/profile/"}
              className="me-2"
            >
              <div className="text-dark">
                <img
                  src={
                    u.avatar
                      ? `${baseUrl}${u.avatar}`
                      : `${userImage}`
                  }
                  alt="User"
                  className="author-img-search"
                />
              </div>
            </Link>
            <Link
              to={u.id !== auth.id ? `/u/${u.id}` : "/profile/"}
              className="d-flex flex-column search-info"
            >
              <div className="text-start ps-1">
                <div className="text-dark">
                  <h6>{u.name}</h6>
                </div>
              </div>
              <div className="text-start ps-1 search-p">
                {u.id === auth.id && <p className="mb-0 ms-2">you</p>}
                {u.id !== auth.id && (
                  <div>
                    <p className="mb-0 mx-1">
                      {u.address ? `Live in ${u.address}. ` : ""}{" "}
                      {u.birthday ? `Birth: ${u.birthday}. ` : ""}
                    </p>
                  </div>
                )}
              </div>
            </Link>
            <div className="ms-auto py-3 pe-1 search-p">
              {/* <p>{u.followed ? "following" : ""}</p> */}
              {!u.followed && u.id !== auth.id && (
                <a
                  role="button"
                  className="btn ms-5 btn-primary btn-search"
                  onClick={() => handleFollow(u.id)}
                >
                  {loadingButton && (
                    <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                  )}
                  {!loadingButton && "follow"}
                </a>
              )}
              {u.followed && u.id !== auth.id && (
                <a
                  role="button"
                  className="btn ms-5 btn-edit-profile btn-search"
                  onClick={() => setShoModal(true)}
                >
                  {loadingButton && (
                    <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                  )}
                  {!loadingButton && "following"}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchBox;
