import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLazyCheckEmailExistQuery, useRegisterMutation } from "../../app/services/auth.service";
import style from "./Auth.module.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

function Register() {
  const [registerUser] = useRegisterMutation();
  const [checkMailExist] = useLazyCheckEmailExistQuery();
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  // const [passConfirm, setPassConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordAgain, setShowPasswordAgain] = useState(false);
  const navigate = useNavigate();

  const schema = yup
    .object({
      email: yup
        .string()
        .email("Email must be a valid email")
        .required("Email is not empty")
        .typeError(""),
      name: yup.string().required("The name is not empty").matches(/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g, "No symbols or special chars"),
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
    setFocus,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const handleRegisterUser = (data) => {
    checkMailExist(data.email)
    .unwrap()
    .then((res) => {
      if (res) {
        toast.error("This email is already used");
        setFocus("email");
      } else {
        registerUser({ email: data.email, name:data.name, password: data.password })
        .unwrap()
        .then(() => {
          toast.success("successfully registered!");
          setTimeout(() => {
            navigate("/login");
          }, 1500);
        })
        .catch((err) => {
          toast.error("Try again.");
          setFocus("email");
          console.log(err);
        });
      }
    }).catch((err) => {
      toast.error("Try again.");
      console.log(err);
    });
  };

  return (
    <>
      <Helmet>
        <title>Register | Hoagram</title>
      </Helmet>
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
                    // onChange={(e) => setEmail(e.target.value)}
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
                    // onChange={(e) => setName(e.target.value)}
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
                    // onChange={(e) => setPassword(e.target.value)}
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
                    // onChange={(e) => setPassConfirm(e.target.value)}
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
                <button className="btn btn-dark" type="submit">
                  Sign up
                </button>
              </div>
            </form>
            <div className="row justify-content-center p-2">
              <div className="col-md-4 border p-3">
                <div className="d-flex justify-content-center">
                  <h3 text-center className={`${style.h3}`}>
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
