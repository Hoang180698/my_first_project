import React from "react";
import { Link } from "react-router-dom";
import {
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../../app/services/notification.service";
import { formatDate, formatDateTime } from "../../../utils/functionUtils";

function NotifyHeader() {
  const { data, isLoading } = useGetAllNotificationQuery();

  const [seenNotifycation] = useSeenNotificationMutation();

  const handleClick = () => {
    if (data && !data[0].seen) {
      seenNotifycation().unwrap().then().catch();
    }
  };

  if (isLoading) {
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
        >
          <i className="fa fa-bell"></i>
        </a>
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
        {data.length > 0 && !data[0].seen && (
          <span className="unread-notification"></span>
        )}
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
                When someone likes or comments on one of your posts, you'll see
                it here.
              </p>
            </>
          )}
          {data.length > 0 &&
            data.map((n) => (
              <div className="header-notifications-list" key={n.id}>
                <Link
                  to={`/u/${n.sender.id}`}
                  className="header-notifications-list_img"
                >
                  <img
                    src={
                      n.sender.avatar
                        ? `http://localhost:8080${n.sender.avatar}`
                        : "../../../../public/user.jpg"
                    }
                  />
                </Link>
                <div className="header-notifications-list_detail">
                  <div>
                    <b>{n.sender.name}</b> <br />
                    {n.type === "follow" && (
                      <p className="text-muted mt-2">Started following you</p>
                    )}
                    {n.type === "like" && (
                      <Link to={`/p/${n.post.id}`}>
                        <span className="text-muted">Liked your post</span>
                      </Link>
                    )}
                    {n.type === "comment" && (
                      <Link to={`/p/${n.post.id}`}>
                        <span className="text-muted">Commented your post</span>
                      </Link>
                    )}
                  </div>
                  {n.type !== "follow" && (
                    <p className="nt-link text-truncate">
                      <Link to={`/p/${n.post.id}`} className="text-dark">
                        {n.type === "like"
                          ? `${n.post.content}`
                          : `${n.comment.content}`}
                      </Link>
                    </p>
                  )}
                </div>
                <p>
                  <small
                    role="button"
                    data-bs-toggle="tooltip"
                    data-placement="bottom"
                    title={formatDateTime(n.createdAt)}
                  >
                    {formatDate(n.createdAt)}
                  </small>
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
