import React, { useEffect, useState } from 'react'
import { useGetFollowerQuery, useLazyGetFollowerQuery } from '../../app/services/user.service'
import UserModal from './UserModal';
import { useSelector } from 'react-redux';
import OwnFollower from './OwnFollower';

function Follower( {userId} ) {

    const { auth } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);
    const [getUsers] = useLazyGetFollowerQuery();

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

    const removeFollower = (id) => {
      const newUsers = users.filter((u) => u.id !== id);
      setUsers(newUsers);
    }

    // const { data, isLoading } = useGetFollowerQuery(userId);
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
        {userId !== auth.id && users.length > 0 && users.map((u) => <UserModal u={u} follow={followUser} unfollow={unfollowUser} />)}
        {userId === auth.id && users.length > 0 && users.map((u) => <OwnFollower u={u} rmFollower={removeFollower}/>)}
      </div>
    </>
  )
}

export default Follower