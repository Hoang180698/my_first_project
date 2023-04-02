import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../app/services/auth.service";
import style from "./Auth.module.css";

function Register() {
  const [register] = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== passConfirm) {
      alert("Password confirm is not correct");
      return;
    }
    register({ email, name, password })
      .unwrap()
      .then(() => {
        alert("successfully registered!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        alert(err.data.message);
      });
  };

  return (
    <>
      <div id="wrapper">
        <div className="container">
          <div className="row justify-content-center p-2">
            <form className="col-md-4 border my-3 p-3" onSubmit={handleSubmit}>
              <h1 className={`${style.h1} text-center text-upercase py-3`}>
                Hoagram
              </h1>
              <div className="form-group my-3 d-flex justify-content-center">
                <h2 className={`${style.h2} text-center`}>
                  Sign up to see photos and videos from your friends.
                </h2>
              </div>
              <hr className="mx-5 py-2" />
              <div className="form-group my-3 d-flex justify-content-center">
                <input
                  type="text"
                  placeholder="Email"
                  required
                  className={`${style.input} form-control`}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group my-3 d-flex justify-content-center">
                <input
                  type="text"
                  placeholder="User name"
                  required
                  className={`${style.input} form-control`}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group my-3 d-flex justify-content-center">
                <input
                  type="password"
                  placeholder="Password"
                  required
                  className={`${style.input} form-control`}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group my-3 d-flex justify-content-center">
                <input
                  type="password"
                  placeholder="Re-Enter the password"
                  required
                  className={`${style.input} form-control`}
                  onChange={(e) => setPassConfirm(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-dark" type="submit">
                  Sign up
                </button>
              </div>
            </form>
            <div className="row justify-content-center p-2">
              <form className="col-md-4 border my-3 p-3">
                <div className="d-flex justify-content-center">
                  <h3 text-center className={`${style.h3}`}>
                    Have an account? <Link to={"../login"}>Log in</Link>
                  </h3>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
