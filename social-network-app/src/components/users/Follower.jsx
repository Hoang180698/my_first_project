import React from 'react'
import { useGetFollowerQuery } from '../../app/services/user.service'
import UserModal from './UserModal';
import { useSelector } from 'react-redux';
import OwnFollower from './OwnFollower';

function Follower( {userId} ) {
    const { auth } = useSelector((state) => state.auth);

    const { data, isLoading } = useGetFollowerQuery(userId);
    if (isLoading) {
        return (
          <div className="container">
            <div className="text-center m-5">
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        );
      }
  return (
    <>
      <div className="modal-body-user mx-3 d-flex flex-column">
        {userId !== auth.id && data.length > 0 && data.map((u) => <UserModal u={u} />)}
        {userId === auth.id && data.length > 0 && data.map((u) => <OwnFollower u={u} />)}
      </div>
    </>
  )
}

export default Follower