import React from 'react'
import { useGetFollowingQuery } from '../../app/services/user.service'
import UserModal from './UserModal';

function Following({ userId }) {

    const { data, isLoading } = useGetFollowingQuery(userId);
    
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
        {data.length > 0 && data.map((u) => <UserModal u={u} />)}
      </div>
    </>
  )
}

export default Following