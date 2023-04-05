import React, { useState } from "react";
import "./Search.css";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { useSelector } from "react-redux";

function Search() {

  const { auth } = useSelector((state) => state.auth);

  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searchUser] = useLazySearchUserQuery();

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
  }
  const handleSearchOther = async (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <>
      <div classNameName="container h-100">
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
        {users.length > 0 && users.map((u) => (
            <div className="col-sm-6 offset-sm-3 search-user" key={u.id}>
            <div className="post-block border">
              <div className="d-flex">
                <div className="me-2">
                  <a href={u.id !== auth.id ? `u/${u.id}` : "my-profile"} className="text-dark">
                    <img
                      src={u.avatar ? `http://localhost:8080${u.avatar}` : "../../../public/user.jpg"}
                      alt="User"
                      className="author-img-search"
                    />
                  </a>
                </div>
                <div className="d-flex flex-column search-info">
                  <div className="text-start ps-1">     
                      <a href={`u/${u.id}`} className="text-dark">
                        <h6>{u.name}</h6>
                      </a>        
                  </div >
                  <div className="text-start ps-1 search-p">
                    {u.id === auth.id && (
                      <p className="mb-0">you</p>
                    )}
                    {u.id !== auth.id && (
                      <p className="mb-0">{u.address}</p>
                    )}                  
                  </div>
                </div>
                <div className="ms-auto py-3 pe-1">
                  <a role="button" className="btn-search btn me-1">
                    following
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      
      </div>
      </div>
     
    </>
  );
}

export default Search;
