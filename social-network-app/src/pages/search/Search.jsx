import React, { useEffect, useRef, useState } from "react";
import "./Search.css";
import { useLazySearchUserQuery } from "../../app/services/user.service";
import { Helmet } from "react-helmet";
import SearchBox from "./SearchBox";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function Search() {
  const { key } = useParams();
  const [term, setTerm] = useState("");
  const [users, setUsers] = useState([]);
  // const [noRes, setNoRes] = useState(false);
  const [searchUser] = useLazySearchUserQuery();
  const [currentPage, setCurrentPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [total, setTotal] = useState(0);

  const loadMoreRef = useRef(null);
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loading) {
      setCurrentPage(Math.floor(users.length / 10));
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
      searchUser({ term: key, page: currentPage, pageSize: 10 })
        .unwrap()
        .then((data) => {
          const filterData = data.content.filter((x) => {
            return !users.some((existingItem) => existingItem.id === x.id);
          });
          setUsers((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error on page load.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [currentPage]);

  useEffect(() => {
    const fectData = async () => {
      if (key) {
        try {
          let { data } = await searchUser({ term: key, page: 0, pageSize: 10 });
          // const filterData = data.content.filter((x) => {
          //   return !users.some((existingItem) => existingItem.id === x.id);
          // });
          setUsers(data.content);
          setIsLast(data.last);
          setTotal(data.totalElements);
        } catch (error) {
          console.log(error);
          navigate("/search");
          toast.error("Check your network.")
        }
      }
    };
    fectData();

    return () => {
      setCurrentPage(0);
    };
  }, [key]);
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
      navigate(`/search/${term}`);
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
      <div className="h-100 ">
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
            {key && (
              <>
                {" "}
                <div className="mt-4 d-flex">
                  <span style={{ fontSize: "18px", fontWeight: "500" }}>
                    Search
                    <small
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#777",
                      }}
                    >
                      {" key "}
                    </small>
                    {key}
                    <small
                      style={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "#777",
                      }}
                    >
                      {` ( result ${total} ) `}
                    </small>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container mt-2">
        <div className="row">
          {/* {(users.length === 0 && term) && (
          <h5 text-center>No results found.</h5>
        )} */}
          {/* {noRes && (
            <div>
              <h4 className="text-center">No result found.</h4>
            </div>
          )} */}
          {users.length > 0 &&
            users.map((u, index) => (
              <SearchBox
                u={u}
                follow={handleFollow}
                unfollow={handleUnfollow}
                key={index}
              />
            ))}
          <div className="mb-2" ref={loadMoreRef}></div>
          {loading && (
            <div className="container">
              <div className="text-center m-3">
                <div className="spinner-border m-3" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            </div>
          )}
          {isLast && users.length > 0 && (
            <span
              className="text-center mb-2"
              style={{ fontSize: "15px", color: "#65676B" }}
            >
              End of results
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default Search;
