import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetConversationByIdQuery,
  useLazyGetMessagesQuery,
  useResetUnreadCountByConversationIdMutation,
} from "../../app/services/chat.service";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import {
  calDistanceTimeMinute,
  formatDateTime,
} from "../../utils/functionUtils";
import InboxHeaderAvatar from "../../components/chat/InboxHeaderAvatar";
import { setCurrentConversationId } from "../../app/slices/currentConversationId.slice";
import InputChat from "../../components/chat/InputChat";

var stompClient = null;
function Inbox() {
  const [isConnected, setIsConnected] = useState(false);
  const { conversationId } = useParams();
  const { auth } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [getMessage] = useLazyGetMessagesQuery();
  // const { data: oldMessage, isLoading: isLoadingMes } = useGetMessagesQuery(conversationId);
  const {
    data: conversation,
    isLoading: isLoadingconversation,
    isError,
  } = useGetConversationByIdQuery(conversationId);
  const navigate = useNavigate();
  const [resetUnreadMessageCount] =
    useResetUnreadCountByConversationIdMutation();
  const effect = useRef(false);

  const dipatch = useDispatch();
  useEffect(() => {
    onDisconnect();
    dipatch(setCurrentConversationId({ id: Number(conversationId) }));
    const fectchData = async () => {
      try {
        let { data } = await getMessage(conversationId);
        setMessages(data);
      } catch (error) {
        console.log(error);
      }
    };
    fectchData();
    resetUnreadMessageCount(conversationId).unwrap().then().catch();
    if (effect.current === true) {
      connect();
      effect.current = true;
    }

    return () => {
      effect.current = true;
      onDisconnect();
      dipatch(setCurrentConversationId({ id: 0 }));
    };
  }, [conversationId]);

  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.debug = () => {};
    stompClient.connect({}, onConnected, onError);
  };

  const onDisconnect = () => {
    if (isConnected) {
      stompClient?.disconnect();
      setIsConnected(false);
    }
  };

  const onError = (err) => {
    console.log(err);
  };

  const onConnected = () => {
    setIsConnected(true);
    stompClient.subscribe(
      "/topic/conversation/" + conversationId,
      onMessageReceived
    );
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setMessages((oldMess) => [payloadData, ...oldMess]);
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
        {messages.map((m, index) => (
          <div
            className={
              m.type === "START"
                ? "mb-auto d-flex flex-column mt-3"
                : "d-flex flex-column"
            }
            key={index}
          >
            {(calDistanceTimeMinute(
              m.createdAt,
              messages[index + 1]?.createdAt
            ) > 20 ||
              index === messages.length - 1) && (
              <span
                className="mx-auto mt-4 mb-1"
                style={{
                  color: "#65676B",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {`${formatDateTime(m.createdAt)}`}
              </span>
            )}

            {m.sender.id !== auth.id &&
              conversation.groupChat &&
              m.type === "MESSAGE" &&
              (m.sender.id !== messages[index + 1]?.sender.id ||
                calDistanceTimeMinute(
                  m.createdAt,
                  messages[index + 1]?.createdAt
                ) > 20) && (
                <>
                  <span
                    className="ms-5 mt-3"
                    style={{ fontSize: "12px", color: "#737373" }}
                  >
                    {m.sender.name}
                  </span>
                </>
              )}
            {m.type === "MESSAGE" && (
              <div
                className={
                  m.sender.id === auth.id
                    ? "d-flex flex-row-reverse message-content-box own-message"
                    : "d-flex message-content-box"
                }
              >
                {m.sender.id !== auth.id && (
                  <div className="mt-auto" style={{ width: "34px" }}>
                    {(m.sender.id !== messages[index - 1]?.sender.id ||
                      calDistanceTimeMinute(
                        m.createdAt,
                        messages[index - 1]?.createdAt
                      ) > 20) && (
                      <>
                        <span className="avatar-inbox">
                          <img
                            src={
                              m.sender.avatar
                                ? `http://localhost:8080${m.sender.avatar}`
                                : "../../../public/user.jpg"
                            }
                          />
                        </span>
                      </>
                    )}
                  </div>
                )}

                <p
                  className={m.sender.id === auth.id ? "mb-1" : " border mb-1"}
                  data-bs-toggle="tooltip"
                  data-placement="bottom"
                  title={formatDateTime(m.createdAt)}
                >
                  {m.content}
                </p>
              </div>
            )}
            {m.type === "START" && (
              <div
                className="d-flex flex-column"
                style={{ marginBottom: "150px" }}
              >
                <span className="mx-auto mt-2">
                  {m.sender.id === auth.id
                    ? `You created this group`
                    : `${m.sender.name} created this group`}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <InputChat stompClient={stompClient} conversationId={conversationId} />
    </div>
  );
}

export default Inbox;
