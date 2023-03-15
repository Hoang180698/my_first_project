import React, { useState } from 'react'
import { Link, Navigate, useNavigate} from 'react-router-dom'
import { useRegisterMutation } from '../../app/services/auth.service'
import styles from "./Auth.module.css";

function Register() {
  const [register] = useRegisterMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if(password !== passConfirm ) {
      alert("Mật khẩu nhập lại chưa chính xác");
      return;
    }
    register({ email, name, password })
        .unwrap()
        .then(() => {
            alert("Đăng ký thành công");

            setTimeout(() => {
                navigate("/login")
            }, 1500)
        })
        .catch((err) => {
            alert(err);
        });
};

  return (
    <>
    <div id="wrapper">
      <div className="container">
        <div className="row justify-content-center p-2">
          <form className="col-md-4 border my-3 p-3" onSubmit={handleSubmit}>
            <h1 className="text-center text-upercase py-3">Hoagram</h1>
            <div className="form-group my-3 d-flex justify-content-center">
              <h2 className="text-center">
                Đăng ký để xem ảnh và video từ bạn bè.
              </h2>
            </div>
            <hr className="mx-5 py-2" />
            <div className="form-group my-3 d-flex justify-content-center">
              <input
                type="text"
                placeholder="Email"
                required
                className="form-control"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group my-3 d-flex justify-content-center">
              <input
                type="text"
                placeholder="Tên"
                required
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group my-3 d-flex justify-content-center">
              <input
                type="password"
                placeholder="Mật khẩu"
                required
                className="form-control"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group my-3 d-flex justify-content-center">
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
                className="form-control"
                onChange={(e) => setPassConfirm(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button className="btn btn-dark" type="submit">
                Đăng ký
              </button>
            </div>
          </form>
          <div className="row justify-content-center p-2">
            <form className="col-md-4 border my-3 p-3">
              <div className="d-flex justify-content-center">
                <h3 text-center>
                  Bạn đã có tài khoản? <Link to={"../login"}>Đăng nhập</Link>
                </h3>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default Register