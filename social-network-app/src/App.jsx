import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Private from "./components/private/Private";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Edit from "./pages/edit-profile/Edit";
import HomePage from "./pages/home/HomePage";
import Messenge from "./pages/messenge/Messenge";
import Notify from "./pages/notify/Notify";
import Profile from "./pages/profile/Profile";
import ProfilePost from "./pages/profile/ProfilePost";
import SavedPost from "./pages/profile/SavedPost";
import Search from "./pages/search/Search";
import User from "./pages/user/User";
import PostDetail from "./pages/post-detail/PostDetail";
import Liker from "./components/liker/Liker";
import NotFound from "./pages/notfound/NotFound";



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
            <Route path="/profile" element={<Profile />}>
              <Route path="" element={<ProfilePost />} />
              <Route path="saved" element={<SavedPost />} />
            </Route>
            <Route path="/edit-profile" element={<Edit />}></Route>
            <Route path="/u/:userId" element={<User />}></Route>
            <Route path="/p/:postId" element={<PostDetail />}></Route>
            <Route path="/likes" element={<Liker />}></Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
