import React from "react";
import { useUpdateUserMutation } from "../../app/services/user.service";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function EditAccount() {

    const { auth } = useSelector((state) => state.auth);
    const [updateUser] = useUpdateUserMutation();

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

      const handleUpdateAccount = (e) => {
        e.preventDefault();
          updateUser({ name, phone, address, gender, biography, birthday })
            .unwrap()
            .then(() => {
              toast.success("successfully updated!");
            })
            .catch((err) => {
              toast.error("Try again")
              console.log(err);
            });
      }

  return (
    <>
      <div
        className="tab-pane fade show active"
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
                <option value="male" selected={gender === "male"}>
                  Male
                </option>
                <option value="female" selected={gender === "female"}>
                  Female
                </option>
                <option value="gay" selected={gender === "gay"}>
                  Gay
                </option>
                <option value="les" selected={gender === "les"}>
                  Les
                </option>
                <option value={""} selected={!gender}>
                  Prefer not to say
                </option>
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
              <textarea
                className="form-control"
                rows="4"
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                maxLength={200}
              ></textarea>
              <span
                style={{ fontSize: "12px" }}
                className={
                  biography && biography.length > 199 ? "text-danger" : ""
                }
              >
                {biography && `${biography.length}/200`}
              </span>
            </div>
          </div>
          <div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={
                name === auth.name &&
                phone === auth.phone &&
                address === auth.address &&
                gender === auth.gender &&
                biography === auth.biography &&
                birthday === auth.birthday
              }
            >
              Update
            </button>
            {/* <button className="btn btn-light" onClick={handleCancelAccount}>Cancel</button> */}
          </div>
        </form>
      </div>
    </>
  );
}

export default EditAccount;
