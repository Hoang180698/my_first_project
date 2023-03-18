import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../app/slices/auth.slice";
import styles from "./Header.module.css";

function Header() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    }
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light px-3 border">
          <div className="container-fluid">
            <a className={`${styles.logo} navbar-brand`} href="#">
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
              <span></span>
              <span></span>
              <span></span>
            </button>
            <div
              className="collapse navbar-collapse justify-content-between"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                <li className="nav-item mx-3">
                  <NavLink
                    to={"/"}
                    className="nav-link"
                  >
                    <i className="fa-solid fa-house"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink 
                    to={"/search"} className="nav-link">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"/messenge"} className="nav-link">
                    <i className="fa-regular fa-comment"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"/notifications"} className="nav-link" href="#">
                    <i className="fa-regular fa-bell"></i>
                  </NavLink>
                </li>
                <li className="nav-item mx-3">
                  <NavLink to={"add-post"} className="nav-link">
                    <i className="fa-regular fa-square-plus"></i>
                  </NavLink>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                {" "}
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item" href="#">
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;
