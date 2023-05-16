import React from "react";

function MessageBox() {
  return (
    <div className="d-flex conversation-container align-items-center">
      <div className="mx-auto d-flex flex-column">
        <i
          className="fa-regular fa-envelope-open text-center"
          style={{ fontSize: "50px" }}
        ></i>
        <h3 className="mt-3">Your Messages</h3>
      </div>
    </div>
  );
}

export default MessageBox;
