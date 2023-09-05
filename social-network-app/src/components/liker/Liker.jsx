import React, { useEffect } from "react";
import { useGetUserLikePostQuery, useLazyGetUserLikePostQuery } from "../../app/services/user.service";
import { useState } from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import UserModal from "../users/UserModal";


function Liker({ postId }) {
  // const { data, isLoading } = useGetUserLikePostQuery({postId:postId, page:0, pageSize:10});
  const [getUsers] = useLazyGetUserLikePostQuery();
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
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
    if(currentPage > 0 && !isLast) {
      setLoading(true);
      getUsers({postId: postId, page: currentPage, pageSize: 10}).unwrap()
      .then((data) => {
         const filterData = data.content.filter((x) => {
            return !users.some((existingItem) => existingItem.id === x.id);
          });
          setUsers((pre) => [...pre, ...filterData]);
          setIsLast(data.last);
      }).catch((err) => {
        console.log(err);
        toast.error("Error on page load.");
      }).finally(() => {
        setLoading(false);
      });
      
    }
  },[currentPage])

  useEffect(() => {
    const fetchData = async () => {
      try {
        let { data } = await getUsers({postId: postId, page:0, pageSize: 10});
        setUsers(data.content);
        setIsLast(data.last);
      } catch (error) {
        console.log(error);
        toast.error("Error on page load.");
      }
    } 
    fetchData();

    return () => {
      setCurrentPage(0);
      setIsLast(false);
    }
  },[])

  const followUser = (id) => {
    const newUsers = users.map((u) => {
      if(u.id === id) {
        const newU = {...u, followed: true};
        return newU;
      }
      return u;
    })
    setUsers(newUsers);
  } 
  
  const unfollowUser = (id) => {
    const newUsers = users.map((u) => {
      if(u.id === id) {
        const newU = {...u, followed: false};
        return newU;
      }
      return u;
    })
    setUsers(newUsers);
  } 

  return (
    <>
      <div className="modal-body-user ms-3 d-flex flex-column">
        {users.length > 0 && users.map((u) => <UserModal u={u} follow={followUser} unfollow={unfollowUser} key={u.id}/>)}
        {loading && (
          <div className="container">
            <div className="text-center m-2">
              <div className="spinner-border m-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
        <div className='ms-2' ref={loadMoreRef}></div>
      </div>
    </>
  );
}

export default Liker;
