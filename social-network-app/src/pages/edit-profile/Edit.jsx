import React, { createRef, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDeleteAvatarMutation, useUpdateUserMutation, useUploadAvatarMutation } from "../../app/services/user.service";
import "./Edit.css";
import Modal from 'react-bootstrap/Modal';
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Edit() {
  const [tabIdx, setTabIdx] = useState(0);
  const [showModal, setShoModal] = useState(false);

  const { auth } = useSelector((state) => state.auth);
  const [updateUser] = useUpdateUserMutation();
  const [uploadAvatar] = useUploadAvatarMutation();
  const [deleteAvatar] = useDeleteAvatarMutation();

  const [name, setName] = useState(auth.name);
  const [phone, setPhone] = useState(auth.phone);
  const [address, setAddress] = useState(auth.address);
  const [gender, setGender] = useState(auth.gender);
  const [biography, setBiography] = useState(auth.biography);
  const [birthday, setBirthday] = useState(auth.birthday);

  const handleSetPhone = (event) => {
    const newPhone = event.target.value.replace(/[^\d]/g, '');
    setPhone(newPhone);
  }

  const handleChangePassword = () => {
    
  }

  const handleUpdateAccount = (e) => {
    e.preventDefault();
      updateUser({ name, phone, address, gender, biography, birthday })
        .unwrap()
        .then(() => {
          toast.success("successfully updated!");
        })
        .catch((err) => {
          toast.error(err.data.message)
          console.log(err);
        });
  }
  // const handleCancelAccount = () => {
  //   setName(auth.name === null ? "" : auth.name);
  //   setPhone(auth.phone === null ? "" : auth.phone);
  //   setAddress(auth.address === null ? "" : auth.address);
  //   setGender(auth.gender);
  //   setBiography(auth.biography === null ? "" : auth.biography);
  // }

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
  }

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
  }
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
                    src={auth.avatar ? `http://localhost:8080${auth.avatar}` : "../../../public/user.jpg" }
                    alt="Image"
                    className="shadow"
                  />
<Modal centered show={showModal} size="sm" >
    <div className="modal-content">
      <div className="modal-header d-flex justify-content-center">
        <h5 className="modal-title text-center" id="staticBackdropLabel">Change profile photo</h5>
      </div>
      <div className="border">
      <label htmlFor="avatar-profile" type="button" className="d-block btn avatar-modal" style={{color:"#0095f6"}}>Upload new photo</label>
      </div>
      {auth.avatar && (
         <div className="border">
         <a onClick={handleDeleteAvatar} type="button" className="d-block btn avatar-modal" style={{color:"red"}}>Remove current photo</a>
         </div>
      )}
      <div className="border">
        <a type="button" className="d-block btn avatar-modal" onClick={() => setShoModal(false)}>Cancel</a>
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
              </div>
            </div>
            <div className="tab-content p-4 p-md-5" id="v-pills-tabContent">
              <div
                className={
                  tabIdx === 0 ? "tab-pane fade show active" : "tab-pane fade"
                }
                id="account"
                role="tabpanel"
                aria-labelledby="account-tab"
              >
                <h3 className="mb-4">Account Settings</h3>
        
                <form className="row" onSubmit={handleUpdateAccount}>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        required
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Phone number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => handleSetPhone(e)}
                        maxLength={12}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        className="form-control"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option value="male" selected={gender === "male"}>Male</option>
                        <option value="female" selected={gender === "female"}>Female</option>
                        <option value="gay" selected={gender === "gay"}>Gay</option>
                        <option value="les" selected={gender === "les"}>Les</option>
                        <option value={""} selected={!gender}>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Birthday</label>
                      <input
                        type="date"
                        className="form-control"
                        lang="fr-CA"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea className="form-control" rows="4" value={biography} onChange={(e) => setBiography(e.target.value)} maxLength={200}>
                      </textarea>
                      <span style={{fontSize: "12px"}} className={(biography && biography.length > 199) ? "text-danger" : ""}>{biography && `${biography.length}/200`}</span>
                    </div>
                  </div>
                  <div>
                  <button className="btn btn-primary"
                    type="submit"
                    disabled={name === auth.name && phone === auth.phone && address === auth.address && gender === auth.gender && biography === auth.biography && birthday === auth.birthday}  >
                    Update
                  </button>
                  {/* <button className="btn btn-light" onClick={handleCancelAccount}>Cancel</button> */}
                </div>
                </form>               
              </div>

                {/* password */}

              <div
                className={
                  tabIdx === 1 ? "tab-pane fade show active" : "tab-pane fade"
                }
                id="password"
                role="tabpanel"
                aria-labelledby="password-tab"
              >
                <h3 className="mb-4">Password Settings</h3>
                <form onSubmit={handleChangePassword}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Old password</label>
                      <input required type="password" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>New password</label>
                      <input required type="password" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Confirm new password</label>
                      <input required type="password" className="form-control" />
                    </div>
                  </div>
                </div>
                <div>
                  <button type="submit" className="btn btn-primary">Update</button>
                  {/* <button className="btn btn-light">Cancel</button> */}
                </div>
                </form>    
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Edit;
