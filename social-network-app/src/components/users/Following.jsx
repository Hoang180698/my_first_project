import React, { useEffect, useState } from 'react'
import { useLazyGetFollowingQuery } from '../../app/services/user.service'
import UserModal from './UserModal';
import { toast } from 'react-toastify';
import { useRef } from 'react';


function Following({ userId }) {

    // const { data, isLoading } = useGetFollowingQuery(userId);

    const [users, setUsers] = useState([]);
    const [getUsers] = useLazyGetFollowingQuery();

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
        getUsers({userId: userId, page: currentPage, pageSize: 10}).unwrap()
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
    },[currentPage]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          let { data } = await getUsers({userId: userId, page:0, pageSize: 10});
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
    

    // if (isLoading) {
    //     return (
    //       <div className="container">
    //         <div className="text-center m-5">
    //           <div className="spinner-border m-5" role="status">
    //             <span className="sr-only">Loading...</span>
    //           </div>
    //         </div>
    //       </div>
    //     );
    //   }
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
  )
}

export default Following