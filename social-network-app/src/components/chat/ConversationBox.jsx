import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../utils/functionUtils";
import { useState } from "react";

function ConversationBox({ data }) {
  const { auth } = useSelector((state) => state.auth);
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
              ? `you: ${data.conversation.lastMessage?.content}`
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
