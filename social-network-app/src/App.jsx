import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Private from './components/private/Private'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import HomePage from './pages/home/HomePage'
import Messenge from './pages/messenge/Messenge'
import Notify from './pages/notify/Notify'
import Search from './pages/search/Search'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Private />}>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<HomePage />}></Route>
                <Route path="/search" element={<Search />}></Route>
                <Route path="/messenge" element={<Messenge />}></Route>
                <Route path="/notifications" element={<Notify />}></Route>
              </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App