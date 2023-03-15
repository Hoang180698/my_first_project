import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Private from './components/private/Private'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Private />}>
              <Route Route path="/" element={<Layout />}>
                
              </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App