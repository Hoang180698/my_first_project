import React, { useRef } from "react";
import { useState } from "react";
import { useChangePassWordMutation } from "../../app/services/user.service";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function EditPassword() {
  // const [oldPass, setOldPass] = useState("");
  // const [newPass, setNewPass] = useState("");
  // const [newPassAgain, setNewPassAgain] = useState("");

  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showNewPassAgain, setShowNewPassAgain] = useState(false);

  const [changePassWord] = useChangePassWordMutation();

  const schema = yup
    .object({
      oldPass: yup.string().required("Old password is not empty"),
      newPass: yup.string().required("Password is not empty").min(3, "Password must have at least 3 characters")
      .notOneOf([yup.ref("oldPass")],"The new password must be different from the old password"),
      retypeNewPass: yup.string().required("Password is not empty").oneOf([yup.ref('newPass'), null], "Passwords do not match"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const keydownSubmit = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  const handleChangePassword = (data) => {
    // e.preventDefault();
    // if (newPass !== newPassAgain) {
    //   toast.error("The password does not match");
    //   return;
    // }
    const newData = { oldPassword: data.oldPass, newPassword: data.newPass };
    changePassWord(newData)
      .unwrap()
      .then(() => {
        toast.success("The password change is successful.");
        setValue("newPass","");
        setValue("oldPass","");
        setValue("retypeNewPass","");
      })
      .catch((err) => {
        toast.error("Enter a valid password and try again.",  {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        setFocus("oldPass");
        console.log(err);
      });
  };

  return (
    <>
      <div
        className="tab-pane fade show active"
        id="password"
        role="tabpanel"
        aria-labelledby="password-tab"
      >
        <h3 className="mb-4">Password Settings</h3>
        <form onSubmit={handleSubmit(handleChangePassword)}>
          <div className="row" style={{height:"114px"}}>
            <div className="col-md-6">
              <div className="form-group">
                <label>Old password</label>
                <div className="form-control d-flex align-items-center">
                  <input
                    type={showOldPass ? "text" : "password"}
                    className="me-2"
                    // value={oldPass}
                    // onChange={(e) => setOldPass(e.target.value)}
                    {...register("oldPass")}
                    maxLength={20}
                  />
                  {(!showOldPass && (
                    <i
                      role="button"
                      className="fa-regular fa-eye-slash"
                      onClick={() => setShowOldPass(true)}
                    ></i>
                  )) || (
                    <i
                      role="button"
                      className="fa-regular fa-eye"
                      onClick={() => setShowOldPass(false)}
                    ></i>
                  )}
                </div>
                <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.oldPass?.message}
                        </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>New password</label>
                <div className="form-control d-flex align-items-center">
                  <input
                    required
                    type={showNewPass ? "text" : "password"}
                    className="me-2"
                    // value={newPass}
                    // onChange={(e) => setNewPass(e.target.value)}
                    {...register("newPass")}
                    maxLength={20}
                  />
                  {(!showNewPass && (
                    <i
                      role="button"
                      className="fa-regular fa-eye-slash"
                      onClick={() => setShowNewPass(true)}
                    ></i>
                  )) || (
                    <i
                      role="button"
                      className="fa-regular fa-eye"
                      onClick={() => setShowNewPass(false)}
                    ></i>
                  )}
                </div>
                <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.newPass?.message}
                        </span>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group mt-2">
                <label>Confirm new password</label>
                <div className="form-control d-flex align-items-center">
                  <input
                    required
                    type={showNewPassAgain ? "text" : "password"}
                    className="me-2"
                    // value={newPassAgain}
                    // onChange={(e) => setNewPassAgain(e.target.value)}
                    {...register("retypeNewPass")}
                    maxLength={20}
                  />
                  {(!showNewPassAgain && (
                    <i
                      role="button"
                      className="fa-regular fa-eye-slash"
                      onClick={() => setShowNewPassAgain(true)}
                    ></i>
                  )) || (
                    <i
                      role="button"
                      className="fa-regular fa-eye"
                      onClick={() => setShowNewPassAgain(false)}
                    ></i>
                  )}
                </div>
                <span style={{ color: "red", fontSize: "12px" }}>
                            {errors.retypeNewPass?.message}
                        </span>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <button type="subbmit" className="btn btn-primary">
              Save changes
            </button>
            {/* <button className="btn btn-light">Cancel</button> */}
          </div>
        </form>
      </div>
    </>
  );
}

export default EditPassword;
