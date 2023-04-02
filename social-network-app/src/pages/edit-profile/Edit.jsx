import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useChangeAvatarMutation, useUpdateUserMutation } from "../../app/services/user.service";
import "./Edit.css";
function Edit() {
  const [tabIdx, setTabIdx] = useState(0);

  const { auth } = useSelector((state) => state.auth);
  const [updateUser] = useUpdateUserMutation();
  const [changeAvatar] = useChangeAvatarMutation();

  const [name, setName] = useState(auth.name);
  const [phone, setPhone] = useState(auth.phone);
  const [address, setAddress] = useState(auth.address);
  const [gender, setGender] = useState(auth.gender);
  const [biography, setBiography] = useState(auth.biography);

  const handleUpdateAccount = () => {
      updateUser({ name, phone, address, gender, biography })
        .unwrap()
        .then(() => {
          alert("successfully updated!");
        })
        .catch((err) => {
          alert(err);
        });
  }
  const handleCancelAccount = () => {
    setName(auth.name === null ? "" : auth.name);
    setPhone(auth.phone === null ? "" : auth.phone);
    setAddress(auth.address === null ? "" : auth.address);
    setGender(auth.gender);
    setBiography(auth.biography === null ? "" : auth.biography);
  }

  return (
    <>
      <section className="py-1">
        <div className="container">
          <div className="bg-white rounded-lg d-block d-sm-flex">
            <div className="profile-tab-nav border-end">
              <div className="p-4">
                <div className="avatar-circle text-center mb-3">
                  <img
                    src="../../../public/user.jpg"
                    alt="Image"
                    className="shadow"
                  />
                </div>

                <div className="text-center">
                  <label
                    htmlFor="avatar-profile"
                    className="btn btn-info btn-sm "
                  >
                    Upload new image
                  </label>
                </div>
                <input
                  className="d-none"
                  type="file"
                  multiple
                  id="avatar-profile"
                  accept="image/png, image/jpeg, image/jpg"
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
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Name</label>
                      <input
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
                        onChange={(e) => setPhone(e.target.value)}
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
                        <option value={null} selected={gender === null}>Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label>Bio</label>
                      <textarea className="form-control" rows="4" value={biography} onChange={(e) => setBiography(e.target.value)}>
                      </textarea>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={handleUpdateAccount}>Update</button>
                  <button className="btn btn-light" onClick={handleCancelAccount}>Cancel</button>
                </div>
              </div>
              <div
                className={
                  tabIdx === 1 ? "tab-pane fade show active" : "tab-pane fade"
                }
                id="password"
                role="tabpanel"
                aria-labelledby="password-tab"
              >
                <h3 className="mb-4">Password Settings</h3>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Old password</label>
                      <input type="password" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>New password</label>
                      <input type="password" className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Confirm new password</label>
                      <input type="password" className="form-control" />
                    </div>
                  </div>
                </div>
                <div>
                  <button className="btn btn-primary">Update</button>
                  <button className="btn btn-light">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Edit;