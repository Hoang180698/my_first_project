import React, { useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import {
  useGetConversationByIdQuery,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useResetUnreadCountByConversationIdMutation,
} from "../../app/services/chat.service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import EmojiPicker from "emoji-picker-react";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import InboxHeaderAvatar from "../../components/chat/InboxHeaderAvatar";
import { setCurrentConversationId } from "../../app/slices/currentConversationId.slice";

var stompClient = null;
function Inbox() {
  const [isConnected, setIsConnected] = useState(false);
  const { conversationId } = useParams();
  const { auth } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [getMessage] = useLazyGetMessagesQuery();
  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  // const { data: oldMessage, isLoading: isLoadingMes } = useGetMessagesQuery(conversationId);
  const { data: conversation, isLoading: isLoadingconversation, isError } =
    useGetConversationByIdQuery(conversationId);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const navigate = useNavigate();
  const [resetUnreadMessageCount] = useResetUnreadCountByConversationIdMutation();
  const effect = useRef(false);

  const dipatch = useDispatch();
  useEffect(() => {
    onDisconnect();
    dipatch(setCurrentConversationId({ id: Number(conversationId) }))
    const fectchData = async () => {
      try {
        let { data } = await getMessage(conversationId);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    fectchData();
    setContent("");
    resetUnreadMessageCount(conversationId).unwrap().then().catch();
    if(effect.current === true) {
      connect();
      effect.current = true;
    }
    
    return () => {
      onDisconnect();
      dipatch(setCurrentConversationId({ id: 0 }))
      effect.current = true;
    };
  }, [conversationId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        !emojiButtonRef.current.contains(event.target)
      ) {
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
    stompClient.debug = () => {};
    stompClient.connect({}, onConnected, onError);
  };

  const onDisconnect = () => {
    if (isConnected) {
      stompClient.disconnect();
      setIsConnected(false);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = () => {
    setIsConnected(true);
    stompClient.subscribe("/topic/conversation/" + conversationId, onMessageReceived);
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
      "/app/message/" + conversationId,
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
  };

  if (isLoadingconversation) {
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

  if (isError) {
    navigate("/messenge");
  }
  return (
    <div className="d-flex flex-column conversation-container">
      <div className="border-bottom p-3">
        <InboxHeaderAvatar conversation={conversation} />
      </div>
      <div className="conversation-content d-flex flex-column-reverse p-3">
        {messages.map((m) => (
          <div
            className={
              m.sender.id === auth.id
                ? "d-flex flex-row-reverse message-content-box own-message justify-content-start align-items-center"
                : "d-flex message-content-box justify-content-start align-items-center"
            }
            key={m.id}
          >
            <p
              className={m.sender.id === auth.id ? "" : " border"}
              data-bs-toggle="tooltip"
              data-placement="bottom"
              title={formatDateTime(m.createdAt)}
            >
              {m.content}
            </p>
          </div>
        ))}
      </div>
      <div className="input-message mx-auto mt-auto mb-3 d-flex border position-relative">
        <a
          role="button"
          className="ms-3 my-auto"
          onClick={() => setShowPicker(true)}
          ref={emojiButtonRef}
        >
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
        <button
          className="btn btn-post-comment btn-block me-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Inbox;
