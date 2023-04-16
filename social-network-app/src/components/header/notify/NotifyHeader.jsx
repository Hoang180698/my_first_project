import React from 'react'
import { Link } from 'react-router-dom'

function NotifyHeader() {
  return (
    <>
     <li className="nav-item mx-3 dropdown notification-ui">
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
                    <span className="unread-notification"></span>
                  </a>
                  <div
                    className="dropdown-menu notification-ui_dd box-shadow"
                    aria-labelledby="navbarDropdown"
                  >
                    <div className="notification-ui_dd-header">
                      <h3 className="text-center">Notification</h3>
                    </div>
                    <div className="notification-ui_dd-content">
                      <a
                        href="#"
                        className="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div className="header-notifications-list_img">
                          <img src="images/users/user1.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>John Doe</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>10 mins ago</small>
                        </p>
                      </a>
                      <a
                        href="#"
                        className="header-notifications-list header-notifications-list--unread text-dark"
                      >
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
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" className="header-notifications-list text-dark">
                        <div className="header-notifications-list_img">
                          <img src="images/users/user3.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>Brian Cumin</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" className="header-notifications-list text-dark">
                        <div className="header-notifications-list_img">
                          <img src="images/users/user4.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>Lance Bogrol</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a
                        href="#!"
                        className="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div className="header-notifications-list_img">
                          <img src="images/users/user1.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>John Doe</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>10 mins ago</small>
                        </p>
                      </a>
                      <a
                        href="#!"
                        className="header-notifications-list header-notifications-list--unread text-dark"
                      >
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
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" className="header-notifications-list text-dark">
                        <div className="header-notifications-list_img">
                          <img src="images/users/user3.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>Brian Cumin</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" className="header-notifications-list text-dark">
                        <div className="header-notifications-list_img">
                          <img src="images/users/user4.jpg" alt="user" />
                        </div>
                        <div className="header-notifications-list_detail">
                          <p>
                            <b>Lance Bogrol</b> <br />
                            <span className="text-muted">reacted to your post</span>
                          </p>
                          <p className="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                    </div>
                    <div className="notification-ui_dd-footer d-grid gap-2">
                      <Link to={"/notifications"} className="btn btn-success btn-block view-all-notify">
                        View All
                      </Link>
                    </div>
                  </div>
                </li>
    </>
  )
}

export default NotifyHeader