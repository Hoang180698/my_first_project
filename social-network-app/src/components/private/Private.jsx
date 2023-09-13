import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

function Private() {
  const { auth, isAuthenticated, token } = useSelector((state) => state.auth);

  if (!isAuthenticated || !auth || !token) {
    return <Navigate to={"/login"}/>;
  }
  return <Outlet />;
}

export default Private