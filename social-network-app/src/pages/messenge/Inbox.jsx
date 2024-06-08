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
// import { over } from "stompjs";
// import SockJS from "sockjs-client";
import {
  calDistanceTimeMinute,
  formatDateTime,
} from "../../utils/functionUtils";
import { setCurrentConversationId } from "../../app/slices/currentConversationId.slice";
import { setMessageRecieve } from "../../app/slices/chat.slice"
const InputChat = React.lazy(() => import("../../components/chat/InputChat"));
import { Suspense } from "react";
import Loading3dot from "../../components/loading/Loading3dot";
import { toast } from "react-toastify";
import ImageBox from "../../components/chat/ImageBox";
import { baseUrl, userImage } from "../../App";
const InboxHeader = React.lazy(() =>
  import("../../components/chat/InboxHeader")
);
var stompClient = null;
function Inbox() {
  const [isConnected, setIsConnected] = useState(false);
  const { conversationId } = useParams();
  const { auth, token } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState([]);
  const [getMessage] = useLazyGetMessagesQuery();
  const listMessageRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  // const [totalPages, setTotalPages] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const {
    data: conversation,
    isLoading: isLoadingconversation,
    isError,
  } = useGetConversationByIdQuery(conversationId);
  const navigate = useNavigate();
  const [resetUnreadMessageCount] =
    useResetUnreadCountByConversationIdMutation();
  // const effect = useRef(false);
  const loadMoreRef = useRef(null);
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };
  const { messageRecieve } = useSelector((state) => state.chat);

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loading) {
      setCurrentPage(Math.floor(messages.length / 10));
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, options);
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, options]);

  const scrollTo = () => {
    listMessageRef.current.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handleScroll = () => {
    if (listMessageRef.current) {
      // const { scrollTop, scrollHeight, clientHeight } = listMessageRef.current;
      // if (
      //   scrollTop + scrollHeight < clientHeight + 2 &&
      //   !loading &&
      //   currentPage < totalPages - 1
      // ) {
      //   setLoading(true);
      //   setCurrentPage(currentPage + 1);
      // }
      if (listMessageRef.current.scrollTop < -1000) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    }
  };
  useEffect(() => {
    const fectchData = () => {
      if (currentPage > 0 && !isLast) {
        setLoading(true);
        getMessage({
          conversationId,
          page: currentPage,
          pageSize: 10,
        })
          .unwrap()
          .then((data) => {
            const filterData = data.content.filter((x) => {
              return !messages.some((existingItem) => existingItem.id === x.id);
            });
            setMessages((pre) => [...pre, ...filterData]);
            setIsLast(data.last);
          })
          .catch((err) => {
            console.log(err);
            toast.error("Error on page load.");
          })
          .finally(() => {
            setLoading(false);
          });
      }
    };
    fectchData();
  }, [currentPage]);

  const dipatch = useDispatch();
  useEffect(() => {
    // onDisconnect();
    dipatch(setCurrentConversationId({ id: Number(conversationId) }));
    const fectchData = async () => {
      setLoading(true);
      try {
        let { data } = await getMessage({
          conversationId,
          page: 0,
          pageSize: 10,
        });
        setMessages(data.content);
        setIsLast(data.last);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fectchData();
    resetUnreadMessageCount(conversationId).unwrap().then().catch();
    // if (effect.current === true) {
    //   connect();
    // }

    return () => {
      // effect.current = true;
      // onDisconnect();
      dipatch(setMessageRecieve(null))
      dipatch(setCurrentConversationId({ id: 0 }));
      resetUnreadMessageCount(conversationId).unwrap().then().catch();
      setMessages([]);
      setCurrentPage(0);
      setIsLast(false);
      setLoading(false);
    };
  }, [conversationId, token]);

  useEffect(() => {
    if(messageRecieve !== null) {
      setMessages((oldMess) => [messageRecieve, ...oldMess]);
      if (["ADDED", "LEAVE", "NAMED"].includes(messageRecieve.type)) {
        resetUnreadMessageCount(conversationId).unwrap().then().catch();
      }
    }
  },[messageRecieve])

  // const connect = () => {
  //   let Sock = new SockJS(`${baseUrl}/ws`);
  //   stompClient = over(Sock);
  //   stompClient.debug = () => {};
  //   stompClient.connect(
  //     { Authorization: `Bearer ${token}` },
  //     onConnected,
  //     onError
  //   );
  // };

  // const onDisconnect = () => {
  //   if (isConnected) {
  //     stompClient?.disconnect();
  //     setIsConnected(false);
  //   }
  // };

  // const onError = (err) => {
  //   console.log(err);
  // };

  // const onConnected = () => {
  //   setIsConnected(true);
  //   stompClient.subscribe(
  //     "/topic/conversation/" + conversationId,
  //     onMessageReceived,
  //     { Authorization: `Bearer ${token}` }
  //   );
  // };

  // const onMessageReceived = (payload) => {
  //   const payloadData = JSON.parse(payload.body);
  //   setMessages((oldMess) => [payloadData, ...oldMess]);
  //   if (["ADDED", "LEAVE", "NAMED"].includes(payloadData.type)) {
  //     resetUnreadMessageCount(conversationId).unwrap().then().catch();
  //   }
  // };

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
    <div className="d-flex flex-column conversation-container position-relative">
      <div className="border-bottom p-3">
        <Suspense fallback={<Loading3dot />}>
          <InboxHeader conversation={conversation} stompClient={stompClient} />
        </Suspense>
      </div>
      {showScrollButton && (
        <span onClick={scrollTo} className="scrollButtonInbox">
          <i className="fa-solid fa-circle-arrow-down"></i>
        </span>
      )}
      <div
        ref={listMessageRef}
        onScroll={handleScroll}
        className="conversation-content d-flex flex-column-reverse p-3"
      >
        {messages.map((m, index) => (
          <div
            className={
              m.type === "START"
                ? "mb-auto d-flex flex-column mt-3"
                : "d-flex flex-column"
            }
            key={index}
          >
            {/* Thoi gian cua message */}
            {((["MESSAGE", "IMAGE"].includes(m.type) &&
              (calDistanceTimeMinute(
                m.createdAt,
                messages[index + 1]?.createdAt
              ) > 20 ||
                messages[index + 1]?.type === "START")) ||
              m.type === "START" ||
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
              ["MESSAGE", "IMAGE"].includes(m.type) &&
              (m.sender.id !== messages[index + 1]?.sender.id ||
                calDistanceTimeMinute(
                  m.createdAt,
                  messages[index + 1]?.createdAt
                ) > 20 ||
                !["MESSAGE", "IMAGE"].includes(messages[index + 1]?.type)) && (
                <>
                  <span
                    className="ms-5 mt-3"
                    style={{ fontSize: "12px", color: "#737373" }}
                  >
                    {m.sender.name}
                  </span>
                </>
              )}

            {["MESSAGE", "IMAGE"].includes(m.type) && (
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
                      ) > 20 ||
                      !["MESSAGE", "IMAGE"].includes(
                        messages[index - 1]?.type
                      )) && (
                      <>
                        <span className="avatar-inbox">
                          <img
                            src={
                              m.sender.avatar
                                ? `${baseUrl + m.sender.avatar}`
                                : `${userImage}`
                            }
                          />
                        </span>
                      </>
                    )}
                  </div>
                )}
                {m.type === "MESSAGE" && (
                  <p
                    className={
                      m.sender.id === auth.id ? "mb-1" : " border mb-1"
                    }
                    data-bs-toggle="tooltip"
                    data-placement="bottom"
                    title={formatDateTime(m.createdAt)}
                  >
                    {m.content}
                  </p>
                )}
                {m.type === "IMAGE" && <ImageBox imageUrl={m.imageUrl} createAt={m.createdAt} />}
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
            {(m.type === "NAMED" ||
              m.type === "ADDED" ||
              m.type === "LEAVE") && (
              <div
                className="d-flex flex-column"
                style={{ fontSize: "12px", color: "#737373" }}
              >
                <span
                  className="mx-auto mt-2 mb-1 text-center"
                  data-bs-toggle="tooltip"
                  data-placement="bottom"
                  title={formatDateTime(m.createdAt)}
                  style={{ maxWidth: "70%", wordWrap: "break-word" }}
                >
                  {m.sender.id === auth.id
                    ? `You ${m.content}.`
                    : `${m.sender.name} ${m.content}.`}
                </span>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="container">
            <div className="text-center m-2">
              <div className="spinner-border m-2" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={loadMoreRef}></div>
      </div>
      <Suspense>
        <InputChat conversationId={conversationId} />
      </Suspense>
    </div>
  );
}

export default Inbox;
