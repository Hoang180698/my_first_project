import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useCheckEmailExistMutation,
  useRegisterMutation,
} from "../../app/services/auth.service";
import style from "./Auth.module.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Modal } from "react-bootstrap";

function Register() {
  const [registerUser] = useRegisterMutation();
  const [checkMailExist] = useCheckEmailExistMutation();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [passConfirm, setPassConfirm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const navigate = useNavigate();

  const handleShow = () => {
    setShowSuccess(true);
  };
  const handleHide = () => {
    setShowSuccess(false);
  };
  const schema = yup
    .object({
      email: yup
        .string()
        .email("Email must be a valid email")
        .required("Email is not empty")
        .typeError(""),
      name: yup
        .string()
        .required("The name is not empty")
        .matches(
          /^[^@!~`#$%^\\&*=+}{;'":?/><|,.]*$/,
          'Cannot contain the characters "~ ` @ ! $ % # ^..."'
        ),
      password: yup
        .string()
        .required("Password is not empty")
        .min(3, "Password must have at least 3 characters"),
      retypePassword: yup
        .string()
        .required("Password is not empty")
        .oneOf([yup.ref("password"), null], "Passwords do not match"),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    setFocus,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleRegisterUser = async (data) => {
    setLoading(true);
    checkMailExist({ email: data.email })
      .unwrap()
      .then((res) => {
        if (res === true) {
          setError("email", {
            type: "manual",
            message: "This email is already used!!!",
          });
          setFocus("email");
          setLoading(false);
        } else {
          registerUser({
            email: data.email,
            name: data.name,
            password: data.password,
          })
            .unwrap()
            .then(() => {
              setShowSuccess(true);
            })
            .catch((err) => {
              toast.error("Try again.");
              setFocus("email");
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      }).catch((err) => {
        console.log(err);
        toast.error("Try again.");
        setLoading(false);
      });
  };

  return (
    <>
      <Helmet>
        <title>Register | Hoagram</title>
      </Helmet>
      <Modal
        centered
        show={showSuccess}
        dialogClassName="modal-width"
        onHide={handleHide}
      >
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "430px" }}
        >
          <div className="text-center">
            <h1 className={`${style.h1} text-center text-upercase py-1`}>
              Hoagram
            </h1>
            <div className="mb-3 text-center">
              <span style={{ fontSize: "100px" }}>
                <i className="fa-solid fa-circle-check"></i>
              </span>
            </div>
            <h1 className="mt-2" style={{ fontWeight: "bold" }}>
              Successfully!
            </h1>
            <p className="mt-3 px-4 successful-register">
              Thank you for signing up. Please check your email to active your
              acount.
            </p>
            {/* <button className="btn btn-primary">Back Home</button> */}
          </div>
        </div>
      </Modal>
      <div id="wrapper">
        <div className="container login-container">
          <div className="row justify-content-center p-2">
            <form
              className="col-md-4 border my-3 p-3"
              onSubmit={handleSubmit(handleRegisterUser)}
            >
              <h1 className={`${style.h1} text-center text-upercase py-1`}>
                Hoagram
              </h1>
              <div className="form-group d-flex justify-content-center">
                <h2 className={`${style.h2} text-center`}>
                  Sign up to see photos and videos from your friends.
                </h2>
              </div>
              <hr className="mx-5 mb-4" />
              <div className="input-box-auth px-2">
                <div className="form-control input-auth">
                  <input
                    type="text"
                    placeholder="Email"
                    className="me-2"
                    {...register("email")}
                  />
                </div>
                <span style={{ color: "red", fontSize: "11px" }}>
                  {errors.email?.message}
                </span>
              </div>

              <div className="input-box-auth px-2">
                <div className="form-control input-auth">
                  <input
                    type="text"
                    placeholder="User name"
                    className="me-2"
                    {...register("name")}
                    maxLength={25}
                  />
                </div>
                <span style={{ color: "red", fontSize: "11px" }}>
                  {errors.name?.message}
                </span>
              </div>
              <div className="input-box-auth px-2">
                <div className="form-control input-auth d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="me-2"
                    {...register("password")}
                    maxLength={20}
                  />
                  {(!showPassword && (
                    <i
                      role="button"
                      className="fa-regular fa-eye-slash"
                      onClick={() => setShowPassword(true)}
                    ></i>
                  )) || (
                    <i
                      role="button"
                      className="fa-regular fa-eye"
                      onClick={() => setShowPassword(false)}
                    ></i>
                  )}
                </div>
                <span style={{ color: "red", fontSize: "11px" }}>
                  {errors.password?.message}
                </span>
              </div>
              <div className="input-box-auth px-2">
                <div className="form-control input-auth d-flex align-items-center">
                  <input
                    type={showPasswordAgain ? "text" : "password"}
                    placeholder="Re-Enter the password"
                    className="me-2"
                    {...register("retypePassword")}
                    maxLength={20}
                  />
                  {(!showPasswordAgain && (
                    <i
                      role="button"
                      className="fa-regular fa-eye-slash"
                      onClick={() => setShowPasswordAgain(true)}
                    ></i>
                  )) || (
                    <i
                      role="button"
                      className="fa-regular fa-eye"
                      onClick={() => setShowPasswordAgain(false)}
                    ></i>
                  )}
                </div>
                <span style={{ color: "red", fontSize: "11px" }}>
                  {errors.retypePassword?.message}
                </span>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <button
                  className="btn btn-dark"
                  type="submit"
                  disabled={loading}
                >
                  {(loading && (
                    <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                  )) ||
                    "Sign up"}
                </button>
              </div>
            </form>
            <div className="row justify-content-center p-2">
              <div className="col-md-4 border p-3">
                <div className="d-flex justify-content-center">
                  <h3 className={`${style.h3}`}>
                    Have an account? <Link to={"/login"}>Log in</Link>
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
