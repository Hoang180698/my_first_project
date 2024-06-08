import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../app/slices/auth.slice";
import useCreatePost from "../../pages/newPost/useCreatePost";
import styles from "./Header.module.css";
import NotifyHeader from "./notify/NotifyHeader";
import messageSound from "../../assets/sound/message-sound.mp3";
import {
  useGetAllUnreadMessageCountQuery,
  useResetUnreadCountByConversationIdMutation,
} from "../../app/services/chat.service";
import "../chat/init";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import {
  receiveMessage,
  setConversationReceive,
  setMessageRecieve,
} from "../../app/slices/chat.slice";
import { useLogOutMutation } from "../../app/services/auth.service";
import { baseUrl, userImage } from "../../App";

export var stompClient = null;

function Header() {
  function refreshPage() {
    window.location.reload(false);
  }
  const sound = new Audio(messageSound);
  const [isConnected, setIsConnected] = useState(false);
  const { currentConversationId } = useSelector(
    (state) => state.currentConversationId
  );
  // const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const { auth, token, refreshToken } = useSelector((state) => state.auth);
  const [logOut] = useLogOutMutation();
  const effect = useRef(false);
  const { onCreatePost } = useCreatePost();
  const { unreadMessageCount, isOpenChatPage } = useSelector(
    (state) => state.chat
  );
  const dispatch = useDispatch();
  const { data } = useGetAllUnreadMessageCountQuery();

  useEffect(() => {
    onDisconnect();
    if (effect.current === true) {
      connect();
    }

    return () => {
      onDisconnect();
      effect.current = true;
    };
  }, [isOpenChatPage, currentConversationId, token]);
  const handleLogout = () => {
    logOut({ refreshToken });
    dispatch(logout());
  };

  const connect = () => {
    let Sock = new SockJS(`${baseUrl}/ws`);
    stompClient = over(Sock);
    stompClient.debug = () => {};
    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      onConnected,
      onError
    );
  };

  const onDisconnect = () => {
    if (stompClient?.connected === true) {
      stompClient?.disconnect();
      setIsConnected(false);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = () => {
    setIsConnected(true);
    stompClient.subscribe(
      "/users/topic/chat",
      (payload) => {
        const payloadData = JSON.parse(payload.body);
        if (payloadData.id.conversationId !== currentConversationId) {
          if (
            payloadData.conversation.lastMessage.sender.id !== auth.id &&
            !payloadData.isArchive
          ) {
            dispatch(receiveMessage());
          }
          if (isOpenChatPage) {
            dispatch(setConversationReceive(payloadData));
          }
        } else {
          dispatch(setConversationReceive({ ...payloadData, unreadCount: 0 }));
        }
        if (
          payloadData.conversation.lastMessage.sender.id !== auth.id &&
          !payloadData.isArchive &&
          payloadData.isOnSound
        ) {
          sound.play();
        }
      },
      { Authorization: `Bearer ${token}` }
    );

    if (currentConversationId > 0) {
      stompClient.subscribe(
        "/topic/conversation/" + currentConversationId,
        onMessageReceived,
        { Authorization: `Bearer ${token}` }
      );
    }
  };
  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    // setMessages((oldMess) => [payloadData, ...oldMess]);
    dispatch(setMessageRecieve(payloadData));
    // if (["ADDED", "LEAVE", "NAMED"].includes(payloadData.type)) {
    //   resetUnreadMessageCount(conversationId).unwrap().then().catch();
    // }
  };

  return (
    <>
      <header className="border-bottom">
        <nav className="navbar navbar-expand-lg navbar-light px-3">
          <div className="container-fluid">
            <a href={"/"} className={`${styles.logo} navbar-brand`}>
              Hoagram
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Link */}
            <div
              className="collapse navbar-collapse justify-content-between"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mx-3">
                  <NavLink
                    to={"/"}
                    className="nav-link"
                    onDoubleClick={refreshPage}
                  >
                    <i className="fa-solid fa-house"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink
                    to={"/search"}
                    className="nav-link"
                    onDoubleClick={refreshPage}
                  >
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"/messenge"} className="nav-link">
                    <i className="fa-regular fa-message position-relative">
                      {unreadMessageCount > 0 && (
                        <span className="unread-message-count-badge">
                          {unreadMessageCount < 100
                            ? unreadMessageCount
                            : "99+"}
                        </span>
                      )}
                    </i>
                  </NavLink>
                </li>
                {/* Thong bao */}
                <li className="nav-item mx-3 dropdown notification-ui">
                  <NotifyHeader />
                </li>
                <li className="nav-item mx-3">
                  <a
                    role="button"
                    className="createpost btn"
                    onClick={onCreatePost}
                  >
                    <i className="fa-regular fa-square-plus"></i>
                  </a>
                </li>
              </ul>

              {/* avatar */}

              <div className="navbar-nav ms-auto mx-2 dropdown">
                <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    className={styles.avatar}
                    src={
                      auth.avatar
                        ? `${baseUrl}${auth.avatar}`
                        : `${userImage}`
                    }
                  />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-lg-end"
                  aria-labelledby="dropdownMenu2"
                >
                  <li>
                    <Link to={"/profile/"} className="dropdown-item" href="#">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/edit-profile"}
                      className="dropdown-item"
                      href="#"
                    >
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={"/notifications"}
                      className="dropdown-item"
                      href="#"
                    >
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      href="#"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
