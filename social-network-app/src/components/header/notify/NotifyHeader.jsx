import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useLazyGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../../app/services/notification.service";
import { formatDate, formatDateTime } from "../../../utils/functionUtils";

function NotifyHeader() {
  const [getNotifications] = useLazyGetAllNotificationQuery();

  const [seenNotifycation] = useSeenNotificationMutation();
  const [notifications, setNotifications] = useState([]);

  const handleClick = () => {
    if (notifications.length > 0 && !notifications[0].seen) {
      seenNotifycation().unwrap().then(() => {
        const newNotify = notifications.map((n) => {
          return { ...n, seen:true};
        })
        setNotifications(newNotify);
      }).catch();
    }
  };

  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loading) {
      setCurrentPage(Math.floor(notifications.length / 10));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, options]);

  useEffect(() => {
    if (currentPage > 0 && !isLast) {
      setLoading(true);
      getNotifications({ page: currentPage, pageSize: 10 })
        .unwrap()
        .then((data) => {
          const filterData = data.content.filter((x) => {
            return !notifications.some((existingItem) => existingItem.id === x.id);
          });
          setNotifications((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPage]);

  useEffect(() => {
    const fectchData = async () => {
      try {
        const { data } = await getNotifications({page:0, pageSize:10});
        setNotifications(data.content);
      } catch (error) {
        console.log(error);
      }
    }
    fectchData();
    return () => {
      setCurrentPage(0);
    }
  },[]);

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
        {notifications.length > 0 && !notifications[0].seen && (
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
          {(notifications.length === 0 && isLast) && (
            <>
              <p className="text-center mt-3 mx-4">
                When someone likes or comments on one of your posts, you'll see
                it here.
              </p>
            </>
          )}
          {notifications.length > 0 &&
            notifications.map((n) => (
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
             <span className="ms-1" ref={loadMoreRef}></span>
              {loading && (
                <div className="container">
                  <div className="text-center m-2">
                    <div className="spinner-border m-2" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                </div>
              )}
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
