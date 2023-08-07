import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utils/functionUtils";

function ConversationBox({ data }) {
  const { auth } = useSelector((state) => state.auth);

  if (data.conversation.groupChat) {
    const users = data.conversation.users;
    const lastMessage = data.conversation.lastMessage;
    const groupName = data.conversation.name
      ? data.conversation.name
      : `${users[0]?.name}${users[1] ? ", " + users[1].name : ""}${
          users[2] ? ", " + users[2].name : ""
        }${users[4] ? ",..." : ""}`;

    return (
      <>
        <NavLink
          className={
            data.unreadCount > 0
              ? "px-3 py-2 d-flex user-chat-box text-dark message-unread "
              : "px-3 py-2 d-flex user-chat-box text-dark"
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
                      ? `http://localhost:8080${users[0].avatar}`
                      : "../../../public/user.jpg"
                  }
                />
              </div>

              <div className="avatar-box-2">
                <img
                  src={
                    users[1].avatar
                      ? `http://localhost:8080${users[1].avatar}`
                      : "../../../public/user.jpg"
                  }
                  className="mt-4 me-2"
                />
              </div>
            </div>
          )) || (
            <div>
              <img
                src={
                  user.avatar
                    ? `http://localhost:8080${user.avatar}`
                    : "../../../public/user.jpg"
                }
                className="avatar-chat"
              />
            </div>
          )}

          <div className="px-2 d-flex flex-column" style={{ maxWidth: "75%" }}>
            <span className="mt-1 chat-user-name">{groupName}</span>

            {/* Last messeage content */}
            {lastMessage.type === "MESSAGE" && (
              <span className="last-message mt-0">
                {lastMessage?.sender.id === auth.id
                  ? `You: ${lastMessage?.content}`
                  : lastMessage?.content}
              </span>
            )}

             {lastMessage.type === "START" && (
              <span className="last-message mt-0">
                {lastMessage?.sender.id === auth.id
                  ? `You created this group`
                  : `${lastMessage?.sender.name} created this group`}
              </span>
            )}
            {/*  */}
            <p role="button" className="mb-0 text-muted time-post">
              {formatDate(lastMessage?.createdAt)}
            </p>
          </div>
        </NavLink>
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
      <NavLink
        className={
          data.unreadCount > 0
            ? "px-3 py-2 d-flex user-chat-box text-dark message-unread "
            : "px-3 py-2 d-flex user-chat-box text-dark"
        }
        to={`/messenge/inbox/${data.id.conversationId}`}
      >
        {data.unreadCount > 0 && <span className="message-badge"></span>}
        <img
          src={
            user.avatar
              ? `http://localhost:8080${user.avatar}`
              : "../../../public/user.jpg"
          }
          className="avatar-chat"
        />
        <div className="px-2 d-flex flex-column" style={{ maxWidth: "75%" }}>
          <span className="mt-1 chat-user-name">{user.name}</span>

          <span className="last-message mt-0">
            {data.conversation.lastMessage?.sender.id === auth.id
              ? `You: ${data.conversation.lastMessage?.content}`
              : data.conversation.lastMessage?.content}
          </span>
          <p role="button" className="mb-0 text-muted time-post">
            {formatDate(data.conversation.lastMessage?.createdAt)}
          </p>
        </div>
      </NavLink>
    </>
  );
}

export default ConversationBox;
