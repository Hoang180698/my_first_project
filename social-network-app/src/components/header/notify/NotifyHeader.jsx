import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  useLazyGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../../app/services/notification.service";
import { formatDate, formatDateTime } from "../../../utils/functionUtils";
import { baseUrl } from "../../../App";

function NotifyHeader() {
  const [getNotifications] = useLazyGetAllNotificationQuery();

  const [seenNotifycation] = useSeenNotificationMutation();
  const [notifications, setNotifications] = useState([]);

  const handleClick = () => {
    if (notifications.length > 0 && !notifications[0].seen) {
      seenNotifycation()
        .unwrap()
        .then(() => {
          const newNotify = notifications.map((n) => {
            return { ...n, seen: true };
          });
          setNotifications(newNotify);
        })
        .catch();
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
            return !notifications.some(
              (existingItem) => existingItem.id === x.id
            );
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
        const { data } = await getNotifications({ page: 0, pageSize: 10 });
        setNotifications(data.content);
      } catch (error) {
        console.log(error);
      }
    };
    fectchData();
    return () => {
      setCurrentPage(0);
    };
  }, []);

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
        {(notifications.length > 0 && !notifications[0].seen) && (
          <span className="unread-notification"></span>
        )}
      </a>
      <ul
        className="dropdown-menu pb-0"
        aria-labelledby="navbarDropdown"
        style={{ width: "360px", maxHeight: "560px" }}
      >
        <div className="border-bottom p-2">
          <h5 style={{ fontWeight: "bold" }} className="">
            Notifications
          </h5>
        </div>
        <div className="notifications-header-container">
          {notifications.length === 0 && isLast && (
            <>
              <p className="text-center mt-3 mx-4">
                When someone likes or comments on one of your posts, you'll see
                it here.
              </p>
            </>
          )}
          {(notifications.length > 0 &&
            notifications.map((n) => (
              <div
                className="header-notifications-box d-flex border-bottom"
                key={n.id}
              >
                <div className="d-flex align-items-center ps-3 pt-1">
                  <Link
                    to={`/u/${n.sender.id}`}
                    className="header-notifications-list_img"
                  >
                    <img
                      src={
                        n.sender.avatar
                          ? `${baseUrl}${n.sender.avatar}`
                          : "../../../../public/user.jpg"
                      }
                      className="mb-2 mt-1"
                    />
                  </Link>
                </div>
                <div
                  className="d-flex flex-column flex-fill"
                  style={{ maxHeight: "100%" }}
                >
                  <div>
                    {n.type === "follow" && (
                      <span className="text-dark mt-3 fw-bold ms-2 d-grid">
                        <small className="fw-bold" style={{ fontSize: "14px" }}>
                          {n.sender.name}
                        </small>
                        <small
                          className="fw-bold text-muted"
                          style={{ fontSize: "14px" }}
                        >
                          Started following you
                        </small>
                      </span>
                    )}
                    {n.type !== "follow" &&(
                       <Link
                       to={`/p/${n.post.id}${n.comment? "/" + n.comment.id : ""}${n.replyComment? "/" + n.replyComment.id : ""}`}
                       className="ms-2 d-block pt-2"
                     >
                       <span className="text-dark">
                         <small
                           className="fw-bold"
                           style={{ fontSize: "14px" }}
                         >
                           {n.sender.name}
                         </small>
                         {` ${n.content}`}
                         {(n.comment && !n.replyComment)? `: ${n.comment.content.substring(0, 24)}`: ""}
                         {(n.comment?.content?.length > 25 && !n.replyComment) ? "..." : ""}
                         {n.replyComment? `: ${n.replyComment.content.substring(0, 24)}`: ""}
                         {n.replyComment?.content.lenth > 25? "..." : ""}
                       </span>
                     </Link>
                    )}
                    {/* {n.type === "like" && (
                      <Link
                        to={`/p/${n.post.id}`}
                        className="ms-2 d-block pt-2"
                      >
                        <span className="text-dark">
                          <small
                            className="fw-bold"
                            style={{ fontSize: "14px" }}
                          >
                            {n.sender.name}
                          </small>
                          {" liked your post"}
                        </span>
                      </Link>
                    )}
                    {n.type === "comment" && (
                      <Link
                        to={`/p/${n.post.id}`}
                        className="ms-2 d-block pt-2"
                      >
                        <small
                          className="fw-bold text-dark"
                          style={{ fontSize: "14px" }}
                        >
                          {n.sender.name}
                        </small>
                        <span className="text-dark">
                          {` commented your post: ${n.comment.content.substring(
                            0,
                            24
                          )}`}
                          {n.comment.content.length > 25 ? "..." : ""}
                        </span>
                      </Link>
                    )}
                    {n.type === "like-comment" && (
                      <Link
                        to={`/p/${n.post.id}`}
                        className="ms-2 d-block pt-2"
                        style={{ maxWidth: "90%" }}
                      >
                        <span className="text-dark">
                          <small
                            className="fw-bold"
                            style={{ fontSize: "14px" }}
                          >
                            {n.sender.name}
                          </small>{" "}
                          {`liked your comment: ${n.comment.content.substring(
                            0,
                            24
                          )}`}
                          {n.comment.content.length > 25 ? "..." : ""}
                        </span>
                      </Link>
                    )} */}
                    {/* {n.post && (
                      <p className="">
                        <Link to={`/p/${n.post.id}`} className="text-dark">
                          {n.post.content.substring(0, 24)}
                        </Link>
                      </p>
                    )} */}
                  </div>
                  <div className="mb-1 ps-2">
                    <small
                      className="text-muted"
                      role="button"
                      data-bs-toggle="tooltip"
                      data-placement="bottom"
                      title={formatDateTime(n.createdAt)}
                      style={{ fontSize: "12px" }}
                    >
                      {formatDate(n.createdAt)}
                    </small>
                  </div>
                </div>
                {n.post && (
                  <div className="notification-list_feature-img me-2 my-auto">
                    {n.post.imageUrls.length > 0 && (
                      <Link to={`/p/${n.post.id}${n.comment? "/" + n.comment.id : ""}${n.replyComment? "/" + n.replyComment.id : ""}`}>
                        <img
                          src={`${baseUrl}${n.post.imageUrls[0]}`}
                          alt="post img"
                          style={{ width: "50px", height: "50px" }}
                        />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))) || (
            <h5 className="text-center mt-4 px-3">
              When someone likes or comments on one of your posts, you'll see it
              here.
            </h5>
          )}
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
        <div className=" d-grid gap-2 mt-auto">
          <Link
            to={"/notifications"}
            className="btn btn-success btn-block view-all-notify"
          >
            Notifications page
          </Link>
        </div>
      </ul>
    </>
  );
}

export default NotifyHeader;
