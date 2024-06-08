import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utils/functionUtils";
import { baseUrl, userImage } from "../../App";

function ConversationBox({ data, toggleArchiveChat, toggleSetSoundNotice }) {
  const { auth } = useSelector((state) => state.auth);

  if (data.conversation.groupChat) {
    const users = data.conversation.users;
    const lastMessage = data.conversation.lastMessage;
    const groupName = data.conversation.name
      ? data.conversation.name
      : `${users[0]?.name}${users[1] ? ", " + users[1].name : ""}${
          users[2] ? ", " + users[2].name : ""
        }${users[4] ? ",..." : ""}`;
    const isOnline = users.some((user) => (user.id !== auth.id && user.isOnline === true)); 

    return (
      <>
        <div className="user-chat-box">
          <NavLink
            className={
              data.unreadCount > 0
                ? "px-3 py-2 d-flex text-dark message-unread"
                : "px-3 py-2 d-flex text-dark"
            }
            to={`/messenge/inbox/${data.id.conversationId}`}
          >
            {data.unreadCount > 0 && <span className="message-badge"></span>}
            {(users.length > 1 && (
              <div className="avatar-group-chat">
                <div className="avatar-box-1">
                  <img
                    src={
                      users[0].avatar
                        ? `${baseUrl}${users[0].avatar}`
                        : `${userImage}`
                    }
                  />
                </div>

                <div className="avatar-box-2">
                  <img
                    src={
                      users[1].avatar
                        ? `${baseUrl}${users[1].avatar}`
                        : `${userImage}`
                    }
                    className="mt-4 me-2"
                  />
                </div>
                {isOnline && <span className="conversation-active"></span>}    
              </div>
            )) || (
              <div className="position-relative">
                <img
                  src={
                    users[0].avatar
                      ? `${baseUrl}${users[0].avatar}`
                      : `${userImage}`
                  }
                  className="avatar-chat"
                />
                <span className="conversation-active"></span>
                {isOnline && <span className="conversation-active"></span>}   
              </div>
            )}

            <div
              className="px-2 d-flex flex-column"
              style={{ maxWidth: "75%" }}
            >
              <span className="mt-1 chat-user-name">{groupName}</span>

              {/* Last messeage content */}
              {lastMessage.type === "MESSAGE" && (
                <span className="last-message mt-0">
                  {lastMessage?.sender.id === auth.id
                    ? `You: ${lastMessage?.content}`
                    : `${lastMessage?.sender.name}: ${lastMessage?.content}`}
                </span>
              )}
              {lastMessage.type !== "MESSAGE" && (
                <span className="last-message mt-0">
                  {lastMessage?.sender.id === auth.id
                    ? `You ${lastMessage?.content}`
                    : `${lastMessage?.sender.name} ${lastMessage?.content}`}
                </span>
              )}
              {/*  */}
              <p role="button" className="mb-0 time-last-message">
                {formatDate(lastMessage?.createdAt)}
              </p>
            </div>
          </NavLink>
          <a
            className="ms-auto conversation-activiti"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-ellipsis" style={{ color: "black" }}></i>
          </a>
          <ul
            className="dropdown-menu dropdown-menu-lg-end"
            aria-labelledby="dropdownMenu2"
          >
            <a
              onClick={() => toggleSetSoundNotice(data.conversation.id)}
              className="dropdown-item"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              {data.isOnSound ? "Mute" : "Unmute"}
            </a>
            <a
              onClick={() => toggleArchiveChat(data.conversation.id)}
              className="dropdown-item"
              style={{ fontWeight: "500", fontSize: "14px" }}
            >
              {data.isArchive ? "Unarchive-chat" : "Archive-chat"}
            </a>
          </ul>
        </div>
      </>
    );
  }
  const user =
    data.conversation.users.length > 1
      ? data.conversation.users[0].id === auth.id
        ? data.conversation.users[1]
        : data.conversation.users[0]
      : data.conversation.users[0];
  return (
    <>
      <div className="user-chat-box">
        <NavLink
          className={
            data.unreadCount > 0
              ? "px-3 py-2 d-flex text-dark message-unread "
              : "px-3 py-2 d-flex text-dark"
          }
          to={`/messenge/inbox/${data.id.conversationId}`}
        >
          {data.unreadCount > 0 && <span className="message-badge"></span>}
          <div className="position-relative">
          <img
            src={
              user.avatar
                ? `${baseUrl}${user.avatar}`
                : `${userImage}`
            }
            className="avatar-chat"
          />
           {user.isOnline && <span className="conversation-active"></span>}   
          </div>
       
          <div className="px-2 d-flex flex-column" style={{ maxWidth: "75%" }}>
            <span className="mt-1 chat-user-name">{user.name}</span>

            <span className="last-message mt-0">
              {data.conversation.lastMessage?.sender.id === auth.id
                ? `You: ${data.conversation.lastMessage?.content}`
                : data.conversation.lastMessage?.content}
            </span>
            <p role="button" className="mb-0 time-last-message">
              {formatDate(data.conversation.lastMessage?.createdAt)}
            </p>
          </div>
        </NavLink>
        <a
          className="ms-auto conversation-activiti"
          href="#"
          id="navbarDropdown"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-ellipsis" style={{ color: "black" }}></i>
        </a>
        <ul
          className="dropdown-menu dropdown-menu-lg-end"
          aria-labelledby="dropdownMenu2"
        >
          <a
            onClick={() => toggleSetSoundNotice(data.conversation.id)}
            className="dropdown-item"
            style={{ fontWeight: "500", fontSize: "14px" }}
          >
            {data.isOnSound ? "Mute" : "Unmute"}
          </a>
          <a
            onClick={() => toggleArchiveChat(data.conversation.id)}
            className="dropdown-item"
            style={{ fontWeight: "500", fontSize: "14px" }}
          >
            {data.isArchive ? "Unarchive-chat" : "Archive-chat"}
          </a>
        </ul>
      </div>
    </>
  );
}

export default ConversationBox;
