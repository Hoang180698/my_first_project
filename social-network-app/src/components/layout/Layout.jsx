import React from 'react'
import { Outlet } from 'react-router-dom'
import NewPost from '../../pages/newPost/NewPost'
import Header from '../header/Header'
import { ToastContainer } from 'react-toastify'

function Layout() {
  return (
    <>
        <div className="container border-bottom container-big">
            <Header />
            
            <section className="content">
                <Outlet />
            </section>
        </div>
        <NewPost/>
        <ToastContainer 
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"/>
    </>
  )
}

export default Layout