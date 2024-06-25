import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { useLoginWithGgMutation } from '../../app/services/auth.service';
import { useSelector } from 'react-redux';
import Loading3dot from '../../components/loading/Loading3dot';
import { toast } from 'react-toastify';

function Authenticate() {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [login] = useLoginWithGgMutation();
    const [loginStatus, setLoginStatus] = useState(0);
    const authCodeRegex = /code=([^&]+)/;
    const isMatch = window.location.href.match(authCodeRegex);
  
    useEffect(() => {  
      if (isMatch) {
        const authCode = isMatch[1];
       login(authCode)
          .then((response) => {
            console.log(response)
            if(response.error) {
              console.log(1)
              setLoginStatus(1);
              navigate("/login");
              toast.error("Login fail", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
              });
            } 
            else {
              toast.success("Login success");
            }
           
          })
          .catch((e) => {
            console.log(e);
            setLoginStatus(1);
            navigate("/login");
            toast.error("Login fail", {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
            });
          })
      }
    }, []);

    if(!isMatch) {
      return <Navigate to={"/login"} />;
    }
  
    if (isAuthenticated) {
      return <Navigate to={"/"} />;
    }
   
  return (
    <>
      {loginStatus === 0 && (
        <div className="d-flex align-items-center justify-content-center" style={{ width: "100vw", height: "100vh" }}>
          <Loading3dot />
        </div> 
      )}
    </>
  )
}

export default Authenticate