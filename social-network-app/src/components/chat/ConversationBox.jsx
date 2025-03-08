import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utils/functionUtils";
import { baseUrl, userImage } from "../../App";
import { OverlayTrigger } from "react-bootstrap";
import Tooltip from 'react-bootstrap/Tooltip';

function ConversationBox({ data, toggleArchiveChat, toggleSetSoundNotice }) {
  const { auth } = useSelector((state) => state.auth);
  const usersCalling = data.conversation.usersInRoom;

  if (data.conversation.groupChat) {
    const users = data.conversation.users;
    const lastMessage = data.conversation.lastMessage;
    const groupName = data.conversation.name
      ? data.conversation.name
      : `${users[0]?.name}${users[1] ? ", " + users[1].name : ""}${
          users[2] ? ", " + users[2].name : ""
        }${users[4] ? ",..." : ""}`;
    const isOnline = users.some((user) => (user.id !== auth.id && user.isOnline === true)); 

    const renderTooltipGroup = (props) => (
      <Tooltip id="button-tooltip" {...props} >
        <div className="d-grid">
          <div className="group-name-calling">
               <span style={{fontWeight:"bold", color:"#eaeaea"}}>{groupName}</span>
          </div>
         
          {usersCalling.length > 0 &&  <div className="d-flex mt-2">
            <span><i className="fa-solid fa-volume-high me-2 pt-2"></i></span>
            <div>
              {usersCalling.map((u, index) => (   
                <span className="avatar-inbox">  
                {index < 5 && <img
                    style={{width:"26px", height:"26px"}}
                     src={
                       u.avatar
                      ? `${baseUrl}${u.avatar}`
                      : `${userImage}`
                  }
                />}  

                {index === 5 && usersCalling.length === 6 &&  <img
                    style={{width:"26px", height:"26px"}}
                     src={
                       u.avatar
                      ? `${baseUrl}${u.avatar}`
                      : `${userImage}`
                  }
                />}           
                {index === 5 && usersCalling.length > 6 &&  <i style={{fontWeight:"bolder"}}>
                     +{usersCalling.length - 5}
            </i>}   
              </span>
              ))}
            </div>
          </div>}
         
        </div>
      </Tooltip>
    );

    return (
      <OverlayTrigger placement="right"
      delay={{ show: 30, hide: 50 }}
      overlay={renderTooltipGroup}>
        <div className="user-chat-box">
          <NavLink
            className={
              data.unreadCount > 0
                ? "px-3 py-2 d-flex text-dark message-unread"
                : "px-3 py-2 d-flex text-dark"
            }
            to={`/messenge/inbox/${data.id.conversationId}`}
          >
            {data.isOnSound === false && <span><i className="message-badge-mute fa-regular fa-bell-slash"></i></span>}
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
                {usersCalling.length > 0 && <span className="call-active">
                  <i className="fa-solid fa-volume-high"></i>
                  </span>}  
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
                {usersCalling.length > 0 && <span className="call-active">
                  <i className="fa-solid fa-volume-high"></i>
                  </span>}  
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
      </OverlayTrigger>
    );
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div className="d-grid">
        <div className="d-flex">
             <span style={{fontWeight:"bold", color:"#eaeaea"}}>{user.name}</span>
        </div>
       
        {usersCalling.length > 0 &&  <div className="d-flex mt-2">
          <span><i className="fa-solid fa-volume-high me-2 pt-2"></i></span>
          <div>
            {usersCalling.map((u) => (   
              <span className="avatar-inbox">               
                 <img
                  style={{width:"26px", height:"26px"}}
                   src={
                     u.avatar
                    ? `${baseUrl}${u.avatar}`
                    : `${userImage}`
                }
              />
            </span>
            ))}
          </div>
        </div>}
       
      </div>
    </Tooltip>
  );
  const user =
    data.conversation.users.length > 1
      ? data.conversation.users[0].id === auth.id
        ? data.conversation.users[1]
        : data.conversation.users[0]
      : data.conversation.users[0];

  return (
    <OverlayTrigger  placement="right"
    delay={{ show: 30, hide: 50 }}
    overlay={renderTooltip}>
      <div className="user-chat-box">
        <NavLink
          className={
            data.unreadCount > 0
              ? "px-3 py-2 d-flex text-dark message-unread "
              : "px-3 py-2 d-flex text-dark"
          }
          to={`/messenge/inbox/${data.id.conversationId}`}
        >
            {data.isOnSound === false && <span><i className="message-badge-mute fa-regular fa-bell-slash"></i></span>}
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
           {usersCalling.length > 0 && <span className="call-active">
                  <i className="fa-solid fa-volume-high"></i>
                  </span>}  
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
    </OverlayTrigger>
  );
}

export default ConversationBox;
