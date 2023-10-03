import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation, useResendEmailActivationMutation } from "../../app/services/auth.service";
import style from "./Auth.module.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";

function Login() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [login] = useLoginMutation();
  const [resendMail] = useResendEmailActivationMutation();
  const [loadingResend, setLoadingResend] = useState(false);

  const [show, setShow] = useState(false);
  const handleHide = () => {
    setShow(false);
  };
  const handleResendMail = () => {
    setLoadingResend(true);
    resendMail({email: email}).unwrap()
    .then(() => {
      toast.success("Resend successfully. Check your email");
    })
    .catch(err => {
      console.log(err);
      toast.error("Try again.");
    })
    .finally(() => {
      setLoadingResend(false);
    })
  }

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    login({ email, password })
      .unwrap()
      .then(() => {
        toast.success("Login success");
      })
      .catch((err) => {
        if (err.data?.message === "User is disabled") {
          setShow(true);
        } else {
          toast.error(
            "Please check your password and email and try again.",
            {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            }
          );
          console.log(err);
        }
      }).finally(() => {
        setLoading(false);
      });
  };
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <Helmet>
        <title>Login | Hoagram</title>
      </Helmet>
      <Modal
        centered
        show={show}
        dialogClassName="modal-width"
        onHide={handleHide}
      >
        <div
          className="d-flex justify-content-center pt-5"
          style={{ height: "400px" }}
        >
          <div className="text-center">
          <h1 className={`${style.h1} text-center text-upercase mb-4`}>
                Hoagram
              </h1>
            <h4 className="mt-2" style={{ fontWeight: "bold" }}>
              Couldn't sign you in!
            </h4>
            <p className="mt-3 px-4 successful-register">
              Your account has not been activated, please check your email.
            </p>
            {/* <button className="btn btn-primary">Back Home</button> */}
          </div>
        </div>
        <div className="ms-auto mb-2 me-2" onClick={handleResendMail}>
          <button className="btn btn-primary">  {(loadingResend && (
                    <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                  )) ||
                    "Resend email"}</button>
        </div>
      </Modal>
      <div id="wrapper">
        <div className="container login-container">
          <div className="row justify-content-center py-5">
            <form className="col-md-3 border my-3 p-3" onSubmit={handleSubmit}>
              <h1 className={`${style.h1} text-center text-upercase py-3`}>
                Hoagram
              </h1>
              <div className="form-group my-3 d-flex justify-content-center">
                <div className="form-control input-auth d-flex align-items-center">
                  <input
                    type="text"
                    placeholder="Email"
                    required
                    className="me-2"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group my-3 d-flex justify-content-center">
                <div className="form-control input-auth d-flex align-items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="me-2"
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-dark" type="submit" disabled={loading}>
                {(loading && (
                    <i className="fa-solid fa-circle-notch fa-spin mx-3"></i>
                  )) ||
                    "Log in"}
                </button>
              </div>
              <hr className="mx-5 mt-4" />
              <div className="d-flex justify-content-center">
                <h3 className={`${style.h3}`}>
                  <Link to={"/forgot-password"} className={`${style.fp}`}>
                    Forgot password?
                  </Link>
                </h3>
              </div>
            </form>
            <div className="row justify-content-center p-2">
              <div className="col-md-3 border my-3 p-3">
                <div className="d-flex justify-content-center">
                  <h3 className={`${style.h3}`}>
                    Don't have an account? <Link to={"/register"}>Sign up</Link>
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

export default Login;
