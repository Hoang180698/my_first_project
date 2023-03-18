import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../app/services/auth.service";
import style from "./Auth.module.css";


function Login() {

  const { isAuthenticated } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    login({ email, password })
        .unwrap()
        .then(() => {
            alert("Login thành công");

            setTimeout(() => {
                navigate("/")
            }, 1500)
        })
        .catch((err) => {
            alert(err);
        });
};
  if(isAuthenticated) {
    return <Navigate to={"/"}/>
  }
  return (
    <>
      <div id="wrapper">
        <div className="container">
          <div className="row justify-content-center p-2">
            <form className="col-md-3 border my-3 p-3" onSubmit={handleSubmit}>
              <h1 className={`${style.h1} text-center text-upercase py-3`}>Hoagram</h1>
              <div className="form-group my-3 d-flex justify-content-center">
              </div>
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
                  type="password"
                  placeholder="Mật khẩu"
                  required
                  className={`${style.input} form-control`}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-dark" type="submit">
                  Đăng nhập
                </button>
              </div>
              <hr className="mx-5 mt-4" />
              <div className="d-flex justify-content-center">
                  <h3 text-center className={`${style.h3}`}>
                    <Link style={{color: "rgb(122, 122, 202)"}} to={"#"}>Quên mật khẩu?</Link>
                  </h3>
                </div>
            </form>
            <div className="row justify-content-center p-2">
              <form className="col-md-3 border my-3 p-3">
                <div className="d-flex justify-content-center">
                  <h3 text-center className={`${style.h3}`}>
                    Bạn chưa có tài khoản? <Link to={"../register"}>Đăng ký</Link>
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

export default Login;
