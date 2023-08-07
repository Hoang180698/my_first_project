import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/services/auth.service";
import style from "./Auth.module.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Login() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false)
  const [login] = useLoginMutation();
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

    login({ email, password })
      .unwrap()
      .then(() => {
        window.location.reload(false);
        toast.success("Login success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      })
      .catch((err) => {
        toast.error("Please check your password and account name and try again.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
          console.log(err)
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
                  type={showPassword? "text" : "password"}
                  placeholder="Password"
                  required
                  className="me-2"
                  onChange={(e) => setPassword(e.target.value)}
                />
                 {!showPassword &&
                   <i role="button" className="fa-regular fa-eye-slash" onClick={() => setShowPassword(true)}></i>
                    ||
                    <i role="button"  className="fa-regular fa-eye" onClick={() => setShowPassword(false)}></i>
                  }
                </div>
               
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-dark" type="submit">
                  Log in
                </button>
              </div>
              <hr className="mx-5 mt-4" />
              <div className="d-flex justify-content-center">
                <h3 text-center className={`${style.h3}`}>
                  <Link to={"#"} className={`${style.fp}`}>
                    Forgot password?
                  </Link>
                </h3>
              </div>
            </form>
            <div className="row justify-content-center p-2">
              <div className="col-md-3 border my-3 p-3">
                <div className="d-flex justify-content-center">
                  <h3 text-center className={`${style.h3}`}>
                    Don't have an account?{" "}
                    <Link to={"/register"}>Sign up</Link>
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
