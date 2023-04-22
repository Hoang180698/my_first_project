import React, { useEffect } from "react";
import { useGetUserLikePostQuery } from "../../app/services/user.service";
import LikerUser from "./LikerUser";


function Liker({ postId }) {
  const { data, isLoading } = useGetUserLikePostQuery(postId);

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
        {data.length > 0 && data.map((u) => <LikerUser u={u} />)}
      </div>
    </>
  );
}

export default Liker;
