import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  useCheckEmailExistMutation,
  useForgotPasswordMutation,
} from "../../app/services/auth.service";
import style from "./Auth.module.css";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

function ForgotPassword() {
  const [checkMailExist] = useCheckEmailExistMutation();
  const [forgotPassword] = useForgotPasswordMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleHide = () => setShowSuccess(false);

  const schema = yup
    .object({
      email: yup
        .string()
        .email("Email must be a valid email")
        .required("Email is not empty")
        .typeError(""),
    })
    .required();

  const {
    register,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });
  const handleGetPassword = (data) => {
    setLoading(true);
    checkMailExist({ email: data.email })
      .unwrap()
      .then((res) => {
        if (res === false) {
          setError("email", {
            type: "manual",
            message: "Not user found!!!",
          });
          setLoading(false);
        } else {
          forgotPassword({
            email: data.email
          })
            .unwrap()
            .then(() => {
              setShowSuccess(true);
            })
            .catch((err) => {
              toast.error("Try again.");
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
  }

  return (
    <>
      <Helmet>
        <title>Reset password | Hoagram</title>
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
            We have sent a reset password link to your email. Please check!
            </p>
            {/* <button className="btn btn-primary">Back Home</button> */}
          </div>
        </div>
      </Modal>
      <div className="container login-container">
        <div className="row justify-content-center py-5">
          <div className="col-md-4 border mt-3 pt-3" style={{padding:"16px 0 0 0"}}>
            <div className="text-center d-grid px-3">
              <span className="mb-3 mt-2">
              <i style={{fontSize:"40px", borderRadius:"50%", border:"solid", width:"90px", height:"90px"}} className="fa-solid fa-lock p-4"></i>
              </span>
              <span className="mb-2" style={{fontSize: "16px", fontWeight:"450"}}>
              Trouble logging in?
              </span>
              <span style={{fontSize:"14px", color:"#737373"}}>
              Enter your email and we'll send you a link to get back into your account.
              </span>
            </div>
            <form onSubmit={handleSubmit(handleGetPassword)}>
            <div style={{height:"68px"}}  className="form-group my-3 d-flex flex-column justify-content-center px-4">
              <div className="form-control input-auth d-flex align-items-center">
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
            <div className="d-flex justify-content-center">
              <button disabled={loading} className="btn btn-primary" type="submit" style={{fontSize:"14px", width:"240px"}}>
                Send login link
              </button>
            </div>
            </form>
           
            <hr className="mx-5 mt-4" />
            <div className="d-flex justify-content-center mt-4">
              <h3 className={`${style.h3}`}>
                <Link to={"/register"} className={`${style.fp}`}>
                  {"Create new account"}
                </Link>
              </h3>
            </div>
            <div className="mt-5">
              <Link to={"/login"} className="text-center d-flex mt-5 border-top" style={{backgroundColor:"#FAFAFA"}}>
                <span className="mx-auto my-2 text-dark" style={{fontSize:"14px", fontWeight:"450"}}>{"Back to login"}</span>
                </Link>
              </div>
          </div>
        </div>
      </div>
    
    </>
  );
}

export default ForgotPassword;
