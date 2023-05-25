import React, { useEffect, useState } from 'react'
import { useGetFollowingQuery, useLazyGetFollowingQuery } from '../../app/services/user.service'
import UserModal from './UserModal';
import { set } from 'react-hook-form';

function Following({ userId }) {

    // const { data, isLoading } = useGetFollowingQuery(userId);

    const [users, setUsers] = useState([]);
    const [getUsers] = useLazyGetFollowingQuery();

    useEffect(() => {
      const fetchData = async () => {
        let { data } = await getUsers(userId);
        setUsers(data);
      } 
      fetchData();
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
      <div className="modal-body-user mx-3 d-flex flex-column">
        {users.length > 0 && users.map((u) => <UserModal u={u} follow={followUser} unfollow={unfollowUser} key={u.id}/>)}
      </div>
    </>
  )
}

export default Following