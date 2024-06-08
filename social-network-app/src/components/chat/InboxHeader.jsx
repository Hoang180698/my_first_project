import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ChangeGroupName from "./ChangeGroupName";
import AddPeople from "./AddPeople";
import LeaveGroup from "./LeaveGroup";
import MemberGroup from "./MemberGroup";
import { baseUrl, userImage } from "../../App";

function InboxHeader({ conversation, stompClient }) {
  const { auth } = useSelector((state) => state.auth);

  if (conversation.groupChat === true) {
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
                  ? `${baseUrl}${users[0].avatar}`
                  : `${userImage}`
              }
            />
          </span>
          {users.length > 1 && (
            <span className="avatar-inbox">
              <img
                src={
                  users[1]?.avatar
                    ? `${baseUrl}${users[1].avatar}`
                    : `${userImage}`
                }
              />
            </span>
          )}

          {users.length > 2 && (
            <span className="avatar-inbox">
              <img
                src={
                  users[2]?.avatar
                    ? `${baseUrl}${users[2].avatar}`
                    : `${userImage}`
                }
              />
            </span>
          )}

          {users.length === 4 && (
            <span className="avatar-inbox">
              <img
                src={
                  users[3]?.avatar
                    ? `${baseUrl}${users[3].avatar}`
                    : `${userImage}`
                }
              />
            </span>
          )}
          {users.length > 4 && (
            <span className="avatar-inbox-number pt-1">
              +{users.length - 3}
            </span>
          )}
          <span className="inbox-user-name ms-2">{groupName}</span>

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
            style={{ fontWeight: "bold" }}
          >
            <li>
              <ChangeGroupName
                conversation={conversation}
                stompClient={stompClient}
              />
            </li>
            <li>
              <AddPeople
                conversation={conversation}
                stompClient={stompClient}
              />
            </li>
            <li>
              <MemberGroup users={conversation.users} />
            </li>
            <li className="border-top">
              <LeaveGroup
                stompClient={stompClient}
                conversationId={conversation.id}
              />
            </li>
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
      <div className="d-flex">
        <Link to={`/u/${user.id}`} className="text-dark">
          <img
            src={
              user.avatar
                ? `${baseUrl}${user.avatar}`
                : `${userImage}`
            }
            className="avatar-inbox ms-4"
          />
          <span className="mt-2 inbox-user-name ms-2">{user.name}</span>
        </Link>
        <div
          className="ms-auto"
          role="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-bars"></i>
        </div>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
          <li>
            <a className="dropdown-item" role="button">
              {"Nothing :))"}
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default InboxHeader;
