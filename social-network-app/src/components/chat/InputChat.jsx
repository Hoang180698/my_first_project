import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import { over } from "stompjs";
import "./init"
import SockJS from "sockjs-client";

var stompClient = null;


function InputChat({ contactId }) {
    
  const { auth } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    let Sock = new SockJS('http://localhost:8080/ws');
    stompClient = over(Sock);
    stompClient.connect({}, );
    const newMessage = { senderId: auth.id, content: content }
    stompClient.send("/app/message/" +contactId, {}, JSON.stringify(newMessage));
    setContent("");
  };

  return (
    <div className="input-message mx-auto mt-auto mb-3 d-flex border">
      <a role="button" className="ms-3 my-auto">
        <i className="fa-sharp fa-regular fa-face-smile"></i>
      </a>
      <TextareaAutosize
        rows="1"
        type="text"
        className="form-control ms-2"
        maxRows={4}
        placeholder="Message..."
        autoFocus={true}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="btn btn-post-comment btn-block me-2"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
}

export default InputChat;
