import React from "react";

function Loading3dot() {
  return (
    <>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
      <div className="spinner-grow" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </>
  );
}

export default Loading3dot;
