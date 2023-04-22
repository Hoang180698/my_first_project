import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import {
  useRemoveFollowerMutation,
} from "../../app/services/user.service";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function OwnFollower({ u }) {
  const { auth } = useSelector((state) => state.auth);

  const [showModal, setShoModal] = useState(false);
  const [removeFollower] = useRemoveFollowerMutation();

  const handleRemoveFollower = (id) => {
    removeFollower(id)
      .unwrap()
      .then(() => {
        setShoModal(false);
        alert("Removed");
      })
      .catch((err) => {
        alert(err);
      });
  };
 
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
                <h5 className="text-center mt-2">Remove follower?</h5>
                <p className="modal-title text-center mt-1 unfollow-question">
                  We won't tell {u.name} they were removed from your followers.
                </p>
              </div>
              <div className="border-top">
                <a
                  type="button"
                  className="d-block btn avatar-modal text-danger"
                  onClick={() => handleRemoveFollower(u.id)}
                >
                  Remove
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
          <a
            role="button"
            className="btn ms-5 btn-edit-profile"
            onClick={() => setShoModal(true)}
          >
            Remove
          </a>
        </div>
      </div>
    </>
  );
}

export default OwnFollower;