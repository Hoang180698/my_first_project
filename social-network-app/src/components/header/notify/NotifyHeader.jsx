import React from 'react'
import { Link } from 'react-router-dom'

function NotifyHeader() {
  return (
    <>
     <li className="nav-item mx-3 dropdown notification-ui">
                  <a
                    class="nav-link dropdown-toggle notification-ui_icon"
                    href=""
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i class="fa fa-bell"></i>
                    <span class="unread-notification"></span>
                  </a>
                  <div
                    class="dropdown-menu notification-ui_dd show box-shadow"
                    aria-labelledby="navbarDropdown"
                  >
                    <div class="notification-ui_dd-header">
                      <h3 class="text-center">Notification</h3>
                    </div>
                    <div class="notification-ui_dd-content">
                      <a
                        href="#"
                        class="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div class="header-notifications-list_img">
                          <img src="images/users/user1.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>John Doe</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>10 mins ago</small>
                        </p>
                      </a>
                      <a
                        href="#"
                        class="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div class="header-notifications-list_img">
                          <img src="images/users/user2.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Richard Miles</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" class="header-notifications-list text-dark">
                        <div class="header-notifications-list_img">
                          <img src="images/users/user3.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Brian Cumin</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" class="header-notifications-list text-dark">
                        <div class="header-notifications-list_img">
                          <img src="images/users/user4.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Lance Bogrol</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a
                        href="#!"
                        class="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div class="header-notifications-list_img">
                          <img src="images/users/user1.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>John Doe</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>10 mins ago</small>
                        </p>
                      </a>
                      <a
                        href="#!"
                        class="header-notifications-list header-notifications-list--unread text-dark"
                      >
                        <div class="header-notifications-list_img">
                          <img src="images/users/user2.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Richard Miles</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" class="header-notifications-list text-dark">
                        <div class="header-notifications-list_img">
                          <img src="images/users/user3.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Brian Cumin</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                      <a href="#!" class="header-notifications-list text-dark">
                        <div class="header-notifications-list_img">
                          <img src="images/users/user4.jpg" alt="user" />
                        </div>
                        <div class="header-notifications-list_detail">
                          <p>
                            <b>Lance Bogrol</b> <br />
                            <span class="text-muted">reacted to your post</span>
                          </p>
                          <p class="nt-link text-truncate">
                            How to travel long way home from here.
                          </p>
                        </div>
                        <p>
                          <small>1 day ago</small>
                        </p>
                      </a>
                    </div>
                    <div class="notification-ui_dd-footer d-grid gap-2">
                      <Link to={"/notifications"} class="btn btn-dark btn-block view-all-notify">
                        View All
                      </Link>
                    </div>
                  </div>
                </li>
    </>
  )
}

export default NotifyHeader