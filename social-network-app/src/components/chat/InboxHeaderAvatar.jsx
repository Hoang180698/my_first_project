import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function InboxHeaderAvatar({ conversation }) {
  const { auth } = useSelector((state) => state.auth);
  const user =
    conversation.users.length > 1
      ? conversation.users[0].id === auth.id
        ? conversation.users[1]
        : conversation.users[0]
      : conversation.users[0];
  return (
    <>
      <Link to={`/u/${user.id}`} className="text-dark">
        <img
          src={
            user.avatar
              ? `http://localhost:8080${user.avatar}`
              : "../../../public/user.jpg"
          }
          className="avatar-inbox ms-4"
        />
        <span className="mt-2 inbox-user-name ms-2">{user.name}</span>
      </Link>
    </>
  );
}

export default InboxHeaderAvatar;
