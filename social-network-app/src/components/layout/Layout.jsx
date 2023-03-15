import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../header/Header'

function Layout() {
  return (
    <>
        <div className="wrapper-container">
            <Header />

            <section className="content">
                <Outlet />
            </section>
        </div>
    </>
  )
}

export default Layout