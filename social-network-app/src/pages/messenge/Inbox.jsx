import React, { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import { useGetContactByIdQuery, useGetMessagesQuery, useLazyGetMessagesQuery } from "../../app/services/chat.service";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import EmojiPicker from "emoji-picker-react";

var stompClient = null;
function Inbox() {
  const { contactId } = useParams();
  const { auth } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [getMessage] = useLazyGetMessagesQuery();
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false); 
  // const { data: oldMessage, isLoading: isLoadingMes } = useGetMessagesQuery(contactId);
  const { data: contact, isLoading: isLoadingContact } = useGetContactByIdQuery(contactId);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
   const fectchData = async () => {
      let { data } = await getMessage(contactId);
      setMessages(data);
   }
   fectchData();
   setContent("");
  },[contactId])

  useEffect(() => {
    connect();
  }, [contactId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target) && !emojiButtonRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  }

  const onDisconnect = () => {
    if (stompClient !== null) {
      stompClient.disconnect();
    }
  }

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = () => {
    stompClient.subscribe("/topic/contact/" + contactId,
    onMessageReceived);
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setMessages((oldMess) => [payloadData, ...oldMess]);
  };
  const onEmojiClick = (e) => {
    setContent((prevInput) => prevInput + e.emoji);
  };

  const handleSendMessage = () => {
    if (content.length === 0) {
      return;
    }
    const newMessage = { senderId: auth.id, content: content };
    stompClient.send(
      "/app/message/" + contactId,
      {},
      JSON.stringify(newMessage)
    );
    setContent("");
  };

  const handleSendMessageOther = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  }

  if (isLoadingContact) {
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

  if (!contact && !isLoadingContact) {
    navigate("/messenge");
  }
  return (
    <div className="d-flex flex-column conversation-container">
      <div className="border-bottom p-3">
        <Link to={`/u/${contact.user1.id === auth.id ? contact.user2.id : contact.user1.id}`} className="text-dark">
        <img
          src={
            contact.user1.id === auth.id
              ? contact.user2.avatar
                ? `http://localhost:8080${contact.user2.avatar}`
                : "../../../public/user.jpg"
              : contact.user1.avatar
              ? `http://localhost:8080${contact.user1.avatar}`
              : "../../../public/user.jpg"
          }
          className="avatar-inbox ms-4"
        />
        <span className="mt-2 inbox-user-name ms-2">
          {contact.user1.id === auth.id ? contact.user2.name : contact.user1.name}
        </span>
        </Link>
      </div>
      <div className="conversation-content d-flex flex-column-reverse p-3">
        {messages.map((m) => (
          <div
            className={
              m.sender.id === auth.id
                ? "d-flex message-content-box own-message"
                : "d-flex message-content-box"
            }
            key={m.id}
          >
            <p
              className={m.sender.id === auth.id ? "ms-auto" : "me-auto border"}
            >
              {m.content}
            </p>
          </div>
        ))}
      </div>
      <div className="input-message mx-auto mt-auto mb-3 d-flex border position-relative">
        <a role="button" className="ms-3 my-auto" onClick={() => setShowPicker(true)} ref={emojiButtonRef}>
          <i className="fa-sharp fa-regular fa-face-smile"></i>
        </a>
        <TextareaAutosize
          rows="1"
          type="text"
          className="ms-2 my-auto"
          maxRows={4}
          placeholder="Message..."
          autoFocus={true}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => handleSendMessageOther(e)}
        />
            {showPicker && (
                      <div className="emoji-picker" ref={emojiRef}>
                         <EmojiPicker
                        height={400}
                        width={300}
                        onEmojiClick={onEmojiClick}
                        autoFocusSearch={false}
                      />
                      </div>
                    )}
        <button className="btn btn-post-comment btn-block me-2" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Inbox;
