import React from 'react'
import { Outlet } from 'react-router-dom'
import NewPost from '../../pages/newPost/NewPost'
import Header from '../header/Header'

function Layout() {
  return (
    <>
        <div className="container border-bottom">
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