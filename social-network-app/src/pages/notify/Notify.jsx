import React, { useEffect, useState } from "react";
import "./sass/style.scss";
import {
	useDeleteAllNotificationMutation,
  useGetAllNotificationQuery,
  useSeenNotificationMutation,
} from "../../app/services/notification.service";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import { Link } from "react-router-dom";
import NotifyBox from "../../components/notifyBox/NotifyBox";
import { Modal } from "react-bootstrap";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

function Notify() {
  const { data, isLoading } = useGetAllNotificationQuery();

  const [seenNotifycation] = useSeenNotificationMutation();

  const [showModal, setShowModal] = useState(false);

  const [deleteAllNotification] = useDeleteAllNotificationMutation();

  const handleDelteteAllNotification = () => {
	deleteAllNotification().unwrap().then(() => {
		toast.success("Removed all");
	}).catch((err) => {
		toast.error("Something went wrong. Please try again.");
		console.log(err);
	});
  }

  useEffect(() => {
    seenNotifycation().unwrap().then().catch();
  }, []);

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
	<Helmet>
		<title>
			Notification | Hoagram
		</title>
	</Helmet>
	{data.length > 0 && (
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
			{data.length > 0 && (
				 <button className="ms-auto me-3 btn rm-all-notification" onClick={() => setShowModal(true)}>
				 <i className="fa fa-trash me-1"></i>
				  Remove all
			   </button>
			)}  
          </div>

          <div className="notification-ui_dd-content">
			{data.length === 0 && (
				<p className="text-center mt-3 mx-4" style={{fontSize: "24px"}}>
				When someone likes or comments on one of your posts, you'll see it here.
				</p>
			)}
            {data.length > 0 && data.map((n) => <NotifyBox n={n} key={n.id} />)}
          </div>

          <div className="text-center">
            <a href="#" className="dark-link load-more">
              Load more activity
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default Notify;
