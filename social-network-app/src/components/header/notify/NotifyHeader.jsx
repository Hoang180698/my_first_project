import React from "react";
import { Link } from "react-router-dom";
import { useGetAllNotificationQuery, useSeenNotificationMutation } from "../../../app/services/notification.service";
import { formatDate, formatDateTime } from "../../../utils/functionUtils";


function NotifyHeader() {
  const { data, isLoading } = useGetAllNotificationQuery();

  const [seenNotifycation] = useSeenNotificationMutation();

  const handleClick = () => {
    seenNotifycation().unwrap().then().catch();
  }

  if (isLoading) {
    return (
      <>
        <div className="text-center m-5">
          <div className="spinner-border m-5" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <a
        className="nav-link dropdown-toggle notification-ui_icon"
        href=""
        id="navbarDropdown"
        role="button"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={handleClick}
      >
        <i className="fa fa-bell"></i>
        {data.length > 0 && !data[0].seen && <span className="unread-notification"></span>}
      </a>
      <div
        className="dropdown-menu notification-ui_dd box-shadow"
        aria-labelledby="navbarDropdown"
      >
        <div className="notification-ui_dd-header">
          <h3 className="text-center">Notification</h3>
        </div>
        <div className="notification-ui_dd-content">
          {data.length === 0 && (
            <>
              <p className="text-center mt-3 mx-4">
              When someone likes or comments on one of your posts, you'll see it here.
              </p>
            </>
          )}
          {data.length > 0 &&
            data.map((n) => (
              <div className="header-notifications-list header-notifications-list--unread text-dark">
                <div className="header-notifications-list_img">
                  <img src="images/users/user2.jpg" alt="user" />
                </div>
                <div className="header-notifications-list_detail">
                  <p>
                    <b>Richard Miles</b> <br />
                    <span className="text-muted">reacted to your post</span>
                  </p>
                  <p className="nt-link text-truncate">
                    How to travel long way home from here.
                  </p>
                </div>
                <p>
                  <small role="button" data-bs-toggle="tooltip" data-placement="bottom" title={formatDateTime(n.createdAt)}>{formatDate(n.createdAt)}</small>
                </p>
              </div>
            ))}
        </div>
        <div className="notification-ui_dd-footer d-grid gap-2">
          <Link
            to={"/notifications"}
            className="btn btn-success btn-block view-all-notify"
          >
            View All
          </Link>
        </div>
      </div>
    </>
  );
}

export default NotifyHeader;
