import React, { useRef, useState } from "react";
import "./Search.css";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
// import { useUnfollowhUserMutation } from "../../app/services/user.service";
// import { useFollowhUserMutation } from "../../app/services/user.service";

function Search() {
  const { auth } = useSelector((state) => state.auth);

  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUser] = useLazySearchUserQuery();

  const myRef = useRef(null);
  // const [followUser] = useFollowhUserMutation();
  // const [unfollowUser] = useUnfollowhUserMutation();

  // const handleFollow = (id) => {
  //   followUser(id)
  //   .unwrap()
  //   .then(() => {
  //     handleSearch();
  //   })
  //   .catch((err) => {
  //     alert(err);
  //   })
  // }

  // const handleUnfollow = (id) => {
  //   unfollowUser(id)
  //   .unwrap()
  //   .then(() => {
  //     `handleSearch();`
  //   })
  //   .catch((err) => {
  //     alert(err);
  //   })

  // }

  const handleSearch = async () => {
    if (term === "") {
      return;
    } else {
      try {
        let { data } = await searchUser(term);
        setUsers(data);
      } catch (error) {
        alert(error);
      }
    }
  };
  const handleSearchOther = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <div classNameName="h-100 ">
        <div className="d-flex justify-content-center h-100">
          <div className="searchbar my-5">
            <input
              className="search_input"
              type="text"
              name=""
              placeholder="Search..."
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              onKeyDown={(e) => handleSearchOther(e)}
            />
            <a role="button" className="search_icon" onClick={handleSearch}>
              <i className="fas fa-search"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row" ref={myRef}>
          {/* {(users.length === 0 && term) && (
          <h5 text-center>No results found.</h5>
        )} */}
          {users.length > 0 &&
            users.map((u) => (
              <div className="col-sm-6 offset-sm-3 search-user" key={u.id}>
                <Link to={u.id !== auth.id ? `/u/${u.id}` : "/profile/"}>
                  <div className="search-box border">
                    <div className="d-flex">
                      <div className="me-2">
                        <a className="text-dark">
                          <img
                            src={
                              u.avatar
                                ? `http://localhost:8080${u.avatar}`
                                : "../../../public/user.jpg"
                            }
                            alt="User"
                            className="author-img-search"
                          />
                        </a>
                      </div>
                      <div className="d-flex flex-column search-info">
                        <div className="text-start ps-1">
                          <a className="text-dark">
                            <h6>{u.name}</h6>
                          </a>
                        </div>
                        <div className="text-start ps-1 search-p">
                          {u.id === auth.id && <p className="mb-0">you</p>}
                          {u.id !== auth.id && (
                            <div>
                              <p className="mb-0 mx-1">
                                {u.address ? `Live in ${u.address}. ` : ""}{" "}
                                {u.birthday ? `Birth: ${u.birthday}. ` : ""}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="ms-auto py-3 pe-1 search-p">
                        <p>{u.followed ? "following" : ""}</p>
                        {/* {!u.followed && u.id !== auth.id && (
                 <a role='button' className="btn ms-5 btn-primary btn-search" onClick={() => handleFollow(u.id)}>
                 Follow
               </a>
              )}
               {u.followed && u.id !== auth.id && (
                 <a role='button' className="btn ms-5 btn-edit-profile btn-search" onClick={() => handleUnfollow(u.id)}>
                 Unfollow
               </a>
              )} */}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Search;
