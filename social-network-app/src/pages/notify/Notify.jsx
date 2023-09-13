import React, { useEffect, useState } from "react";
import "./sass/style.scss";
import {
	useDeleteAllNotificationMutation,
  useLazyGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../app/services/notification.service";
import NotifyBox from "../../components/notifyBox/NotifyBox";
import { Modal } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useRef } from "react";

function Notify() {
  const [getNotifications] = useLazyGetAllNotificationQuery();
  const [seenNotifycation] = useSeenNotificationMutation();

  const [showModal, setShowModal] = useState(false);

  const [deleteAllNotification] = useDeleteAllNotificationMutation();

  const handleDelteteAllNotification = () => {
	deleteAllNotification().unwrap().then(() => {
		toast.success("Removed all");
		setNotifications([]);
	}).catch((err) => {
		toast.error("Something went wrong. Please try again.");
		console.log(err);
	});
  };
  const handleDeletenotify = (id) => {
	setNotifications((pre) => pre.filter((x) => x.id !==id))
  }
  const [notifications, setNotifications] = useState([]);
  const [currentPageSize, setCurrentPageSize] = useState(0);
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
      setCurrentPageSize(notifications.length + 10);
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
    if (currentPageSize > 0 && !isLast) {
      setLoading(true);
      getNotifications({ page: 0, pageSize: currentPageSize })
        .unwrap()
        .then((data) => {
        //   const filterData = data.content.filter((x) => {
        //     return !notifications.some((existingItem) => existingItem.id === x.id);
        //   });
          setNotifications(data.content);
          setIsLast(data.last);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPageSize]);

  useEffect(() => {
    const fectchData = async () => {
		setLoading(true);
      try {
        const { data } = await getNotifications({page:0, pageSize:10});
        setNotifications(data.content);
      } catch (error) {
        console.log(error);
      } finally {
		setLoading(false);
	  }
    }
    fectchData();
	seenNotifycation().unwrap().then().catch();

	return () => {
		setCurrentPageSize(0);
	}
  },[])

  return (
    <>
	<Helmet>
		<title>
			Notification | Hoagram
		</title>
	</Helmet>
	{notifications.length > 0 && (
		<Modal show={showModal} centered>
		<div className="modal-content">
					  <div className="modal-header d-flex justify-content-center flex-column">
					   
						<p style={{fontSize: "16px"}}
						  className="modal-title text-center mt-2 unfollow-question"
						>
						  Are you sure you want to remove all notifications?
						</p>
					  </div>
					  <div className="border-top">
						<a
						  type="button"
						  className="d-block btn avatar-modal text-danger"
						  onClick={handleDelteteAllNotification}
						>
						  Remove all
						</a>
					  </div>
					  <div className="border-top">
						<a
						  type="button"
						  className="d-block btn"
						  onClick={() => setShowModal(false)}
						>
						  Cancel
						</a>
					  </div>
					</div>
		</Modal>
	)}
      <section className="section-50">
        <div className="container">
          <div className="d-flex mb-4">
            <h3 className="mb-3 heading-line">
              Notifications <i className="fa fa-bell text-muted"></i>
            </h3>
			{notifications.length > 0 && (
				 <button className="ms-auto me-3 btn rm-all-notification" onClick={() => setShowModal(true)}>
				 <i className="fa fa-trash me-1"></i>
				  Remove all
			   </button>
			)}  
          </div>

          <div className="notification-ui_dd-content">
			{(notifications.length === 0 && isLast) && (
				<p className="text-center mt-3 mx-4" style={{fontSize: "24px"}}>
				When someone likes or comments on one of your posts, you'll see it here.
				</p>
			)}
            {notifications.length > 0 && notifications.map((n) => <NotifyBox n={n} key={n.id} deleteNotify={handleDeletenotify}/>)}
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

          <div className="text-center">
            {/* <a href="#" className="dark-link load-more">
              Load more activity
            </a> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Notify;
