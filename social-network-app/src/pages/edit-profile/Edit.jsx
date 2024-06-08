import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  useDeleteAvatarMutation,
  useUploadAvatarMutation,
} from "../../app/services/user.service";
import "./Edit.css";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Suspense } from "react";
import Loading3dot from "../../components/loading/Loading3dot";
import PushNotifications from "./PushNotifications";
import { baseUrl, userImage } from "../../App";
const EditPassword = React.lazy(() => import("./EditPassword"));
const EditAccount = React.lazy(() => import("./EditAccount"));

function Edit() {
  const [tabIdx, setTabIdx] = useState(0);
  const [showModal, setShoModal] = useState(false);

  const { auth } = useSelector((state) => state.auth);

  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    uploadAvatar(formData) // Trả về URL /api/images/1
      .unwrap()
      .then(() => {
        toast.success("Upload avatar successfully");
        setShoModal(false);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
        setShoModal(false);
      });
  };

  const handleDeleteAvatar = () => {
    deleteAvatar()
      .unwrap()
      .then(() => {
        toast.success("Avatar removed");
        setShoModal(false);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
        setShoModal(false);
      });
  };
  return (
    <>
      <Helmet>
        <title>Edit profile | Hoagram</title>
      </Helmet>
      <section className="py-1">
        <div className="container">
          <div className="bg-white rounded-lg d-block d-sm-flex">
            <div className="profile-tab-nav border-end">
              <div className="p-4">
                <div className="avatar-circle text-center mb-3">
                  <img
                    src={
                      auth.avatar
                        ? `${baseUrl}${auth.avatar}`
                        : `${userImage}`
                    }
                    alt="Image"
                    className="shadow"
                  />
                  <Modal centered show={showModal} size="sm">
                    <div className="modal-content">
                      <div className="modal-header d-flex justify-content-center">
                        <h5
                          className="modal-title text-center"
                          id="staticBackdropLabel"
                        >
                          Change profile photo
                        </h5>
                      </div>
                      <div className="border-bottom">
                        <label
                          htmlFor="avatar-profile"
                          type="button"
                          className="d-block btn avatar-modal"
                          style={{ color: "#0095f6" }}
                        >
                          Upload new photo
                        </label>
                      </div>
                      {auth.avatar && (
                        <div className="border-bottom">
                          <a
                            onClick={handleDeleteAvatar}
                            type="button"
                            className="d-block btn avatar-modal"
                            style={{ color: "red" }}
                          >
                            Remove current photo
                          </a>
                        </div>
                      )}
                      <div className="">
                        <a
                          type="button"
                          className="d-block btn avatar-modal"
                          onClick={() => setShoModal(false)}
                        >
                          Cancel
                        </a>
                      </div>
                    </div>
                  </Modal>
                </div>

                <div className="text-center">
                  <label
                    onClick={() => setShoModal(true)}
                    className="btn btn-info btn-sm "
                  >
                    Upload photo
                  </label>
                </div>
                <input
                  className="d-none"
                  type="file"
                  multiple
                  id="avatar-profile"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={(e) => handleUploadAvatar(e)}
                />
              </div>
              <div
                className="nav flex-column nav-pills mt-3 edit-tab"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <a
                  className={tabIdx === 0 ? "nav-link active" : "nav-link"}
                  id="account-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="account"
                  aria-selected="false"
                  onClick={() => setTabIdx(0)}
                >
                  <i className="fa fa-home text-center me-2"></i>
                  Account
                </a>
                <a
                  className={tabIdx === 1 ? "nav-link active" : "nav-link"}
                  id="password-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="password"
                  aria-selected="false"
                  onClick={() => setTabIdx(1)}
                >
                  <i className="fa fa-key text-center me-2"></i>
                  Password
                </a>
                <a
                  className={tabIdx === 3 ? "nav-link active" : "nav-link"}
                  id="password-tab"
                  data-toggle="pill"
                  role="tab"
                  aria-controls="password"
                  aria-selected="false"
                  onClick={() => setTabIdx(3)}
                >
                 <i className="fa-solid fa-bell text-center me-2"></i>
                  Push Notifications
                </a>
              </div>
            </div>
            <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
              <Suspense fallback={<Loading3dot/>}>
                {tabIdx === 0 && <EditAccount />}
                {tabIdx === 1 && <EditPassword />}
                {tabIdx === 3 && <PushNotifications />}
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Edit;
