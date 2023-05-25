import React, { useState } from "react";
import "./Search.css";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { Helmet } from "react-helmet";
import SearchBox from "./SearchBox";

function Search() {

  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [noRes, setNoRes] = useState(false);
  const [searchUser] = useLazySearchUserQuery();

  const handleFollow = (id) => {
    const newUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, followed: true };
      }
      return u;
    });
    setUsers(newUsers);
  };

  const handleUnfollow = (id) => {
    const newUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, followed: false };
      }
      return u;
    });
    setUsers(newUsers);
  };

  const handleSearch = async () => {
    if (term === "") {
      return;
    } else {
      try {
        let { data } = await searchUser(term);
        if (data.length > 0) {
          setNoRes(false);
        } else {
          setNoRes(true);
        }
        setUsers(data);
      } catch (error) {
        console.log(error);
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
      <Helmet>
        <title>Search | Hoagram</title>
      </Helmet>
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
        <div className="row">
          {/* {(users.length === 0 && term) && (
          <h5 text-center>No results found.</h5>
        )} */}
          {noRes && (
            <div>
              <h4 className="text-center">No result found.</h4>
            </div>
          )}
          {users.length > 0 &&
            users.map((u) => (
              <SearchBox u={u} follow={handleFollow} unfollow={handleUnfollow} />
            ))}
        </div>
      </div>
    </>
  );
}

export default Search;
