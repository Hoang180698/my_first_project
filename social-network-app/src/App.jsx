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
import NotFound from "./pages/notfound/NotFound";
import MessageBox from "./pages/messenge/MessageBox";
import Inbox from "./pages/messenge/Inbox";
import { ToastContainer } from "react-toastify";
import PostDetailPage from "./pages/post-detail/PostDetailPage";
import ForgotPassword from "./pages/auth/ForgotPassword";
import userImg from "../public/user.jpg";

// export var baseUrl = "https://hoagramspring-production-8c94.up.railway.app";
export var baseUrl = "http://localhost:8080";
export var userImage = userImg;

function App() {
  return (
    <>
      <Routes>
        <Route element={<Private />}>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/search" element={<Search />}>
              <Route path="/search/:key" element={<Search />}></Route>
            </Route>
            <Route path="/messenge" element={<Messenge />}>
              <Route path="" element={<MessageBox />}></Route>
              <Route path="inbox/:conversationId" element={<Inbox />}></Route>
            </Route>
            <Route path="/notifications" element={<Notify />}></Route>
            <Route path="/profile" element={<Profile />}>
              <Route path="" element={<ProfilePost />} />
              <Route path="saved" element={<SavedPost />} />
            </Route>
            <Route path="/edit-profile" element={<Edit />}></Route>
            <Route path="/u/:userId" element={<User />}></Route>
            <Route path="/p/:postId" element={<PostDetailPage />}>
              <Route path=":commentId" element={<PostDetailPage />}>
                 <Route path=":replyId" element={<PostDetailPage />}></Route>
              </Route>
            </Route>
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />}/>
      </Routes>
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
        theme="light"
      />
    </>
  );
}

export default App;
