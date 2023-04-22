import React, { useState } from 'react'
import Modal from "react-bootstrap/Modal";
import { useFollowhUserMutation, useUnfollowhUserMutation } from "../../app/services/user.service";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function LikerUser({ u }) {
    const { auth } = useSelector((state) => state.auth);

    const [showModal, setShoModal] = useState(false);
    const [followUser] = useFollowhUserMutation();
    const [unfollowUser] = useUnfollowhUserMutation();
  
    const handleFollow = (id) => {
      followUser(id)
      .unwrap()
      .then(() => {
  
      })
      .catch((err) => {
        alert(err);
      })
    }
  
    const handleUnfollow = (id) => {
      unfollowUser(id)
      .unwrap()
      .then(() => {
          setShoModal(false);
      })
      .catch((err) => {
        alert(err);
      })
  
    }
    if (u.id === auth.id) {
        return (
            <>
            <div className="d-flex mt-3">
                    <div className="me-2">
                      <Link to={"/profile/"} className="text-dark d-flex">
                        <img
                          src={
                            u.avatar
                              ? `http://localhost:8080${u.avatar}`
                              : "../../../public/user.jpg"
                          }
                          alt="User"
                          className="author-img-search"
                        />
                        <p className="ms-3 mt-3 name-user-modal">{u.name}</p>
                      </Link>
                     
                    </div>
                    <div className="me-1 ms-auto mt-2 px-3 pt-1">
                            <p className='me-2'>you</p>
                  </div>
                  </div>
      </>
        )
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
                            ? `http://localhost:8080${u.avatar}`
                            : "../../../public/user.jpg"
                        }
                        alt="User"
                        className="author-img-modal"
                      />
                    </div>
                    <p
                      className="modal-title text-center mt-3 unfollow-question"
                    >
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
                  
                  <div className="me-2">
                    <Link to={`/u/${u.id}`} className="text-dark d-flex">
                      <img
                        src={
                          u.avatar
                            ? `http://localhost:8080${u.avatar}`
                            : "../../../public/user.jpg"
                        }
                        alt="User"
                        className="author-img-search"
                      />
                      <p className="ms-3 mt-3 name-user-modal">{u.name}</p>
                    </Link>
                  </div>
                  <div className="me-1 ms-auto mt-2">
                    {!u.followed && (
                      <a role="button" className="btn ms-5 btn-primary" onClick={() => handleFollow(u.id)}>
                        Follow
                      </a>
                    )}
                    {u.followed && (
                      <a
                        role="button"
                        className="btn ms-5 btn-edit-profile"
                        onClick={() => setShoModal(true)}
                      >
                        Following
                      </a>
                    )}
                  </div>
                </div>
    </>
  )
}

export default LikerUser