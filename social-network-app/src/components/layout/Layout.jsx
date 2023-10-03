import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import NewPost from '../../pages/newPost/NewPost'
import Header from '../header/Header'
import { useEffect } from 'react'
import { useRefreshTokenMutation } from '../../app/services/auth.service'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { logout } from '../../app/slices/auth.slice'

function Layout() {
  const { refreshToken } = useSelector((state) => state.auth);
  const [refreshJWTToken] = useRefreshTokenMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const handleRefreshToken = () => {
      refreshJWTToken({refreshToken: refreshToken}).unwrap()
      .then().catch((err) => {
        dispatch(logout());
        navigate("/login");
        console.log(err)
        if(err.status != 400) {
          toast.error("error networking!");
          return;
        }
        toast.error("Your session has timed out or network error, you have been logged out.",  {
          position: "top-center",
        });
       
      })
    }
    handleRefreshToken();
    const interval = setInterval(() => {
      handleRefreshToken();
    }, 1000*60*19);
    return () => clearInterval(interval);
  },[])
  return (
    <>
        <div className="container border-bottom container-big">
            <Header />
            
            <section className="content">
                <Outlet />
            </section>
        </div>
        <NewPost/>
    </>
  )
}

export default Layout