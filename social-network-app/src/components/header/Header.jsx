
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { logout } from "../../app/slices/auth.slice";
import useCreatePost from "../../pages/newPost/useCreatePost";
import styles from "./Header.module.css";
import NotifyHeader from "./notify/NotifyHeader";


function Header() {
  function refreshPage() {
    window.location.reload(false);
  }

  const { auth } = useSelector((state) => state.auth);
  const { onCreatePost } = useCreatePost();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };


  return (
    <>
      <header className="border-bottom">
        <nav className="navbar navbar-expand-lg navbar-light px-3">
          <div className="container-fluid">
            <a href={"/"} className={`${styles.logo} navbar-brand`}>
              Hoagram
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Link */}
            <div
              className="collapse navbar-collapse justify-content-between"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mx-3">
                  <NavLink to={"/"} className="nav-link" onDoubleClick={refreshPage}>
                    <i className="fa-solid fa-house"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"/search"} className="nav-link" onDoubleClick={refreshPage}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"/messenge"} className="nav-link">
                    <i className="fa-regular fa-message"></i>
                  </NavLink>
                </li>
                {/* Thong bao */}
                <li className="nav-item mx-3 dropdown notification-ui">
                <NotifyHeader />
                </li>
                <li className="nav-item mx-3">
                  <a
                    role="button"
                    className="createpost btn"
                    onClick={onCreatePost}
                  >
                    <i className="fa-regular fa-square-plus"></i>
                  </a>
                </li>
              </ul>

              {/* avatar */}

              <div className="navbar-nav ms-auto mx-2 dropdown">
                <a
                  className="nav-link"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img className={styles.avatar} src={auth.avatar === null ? "../../public/user.jpg" : `http://localhost:8080${auth.avatar}`} />
                </a>
                <ul
                  className="dropdown-menu dropdown-menu-lg-end"
                  aria-labelledby="dropdownMenu2"
                >
                  <li>
                    <Link to={"/profile/"} className="dropdown-item" href="#">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to={"/edit-profile"} className="dropdown-item" href="#">
                      Edit
                    </Link>
                  </li>
                  <li>
                    <Link to={"/notifications"} className="dropdown-item" href="#">
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                      href="#"
                    >
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
