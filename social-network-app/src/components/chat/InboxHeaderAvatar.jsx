import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ChangeGroupName from "./ChangeGroupName";

function InboxHeaderAvatar({ conversation }) {
  const { auth } = useSelector((state) => state.auth);

  if (conversation.groupChat) {
    const users = conversation.users;
    const groupName = conversation.name
      ? conversation.name
      : `${users[0]?.name}${users[1] ? ", " + users[1].name : ""}${
          users[2] ? ", " + users[2].name : ""
        }${users[4] ? ",..." : ""}`;
    return (
      <>
        <div className="avatars-inbox ms-4 d-flex">
          <span className="avatar-inbox">
            <img
              src={
                users[0]?.avatar
                  ? `http://localhost:8080${users[0].avatar}`
                  : "../../../public/user.jpg"
              }
            />
          </span>
          <span className="avatar-inbox">
            <img
              src={
                users[1]?.avatar
                  ? `http://localhost:8080${users[1].avatar}`
                  : "../../../public/user.jpg"
              }
            />
          </span>
          {users.length > 2 && (
            <span className="avatar-inbox">
              <img
                src={
                  users[2]?.avatar
                    ? `http://localhost:8080${users[2].avatar}`
                    : "../../../public/user.jpg"
                }
              />
            </span>
          )}

          {users.length === 4 && (
            <span className="avatar-inbox">
              <img
                src={
                  users[3]?.avatar
                    ? `http://localhost:8080${users[3].avatar}`
                    : "../../../public/user.jpg"
                }
              />
            </span>
          )}
          {users.length > 4 && (
            <span className="avatar-inbox-number pt-1">
              +{users.length - 3}
            </span>
          )}
          <span className="mt-2 inbox-user-name ms-2">{groupName}</span>

          <div
                className="ms-auto"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fa-solid fa-bars"></i>
              </div>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenu2"
              >
                  <li><ChangeGroupName conversationId={conversation.id}/></li>
                  <li><a className="dropdown-item" role="button">Add people</a></li>
                  <li><a className="dropdown-item text-danger" role="button">Leave group</a></li>
          
              </ul>
        </div>
      </>
    );
  }

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
