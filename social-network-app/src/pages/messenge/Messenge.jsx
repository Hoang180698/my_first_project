import React from "react";
// import "./chat.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  useLazyGetArchiveConversationsQuery,
  useLazyGetConversationsQuery,
  useToggleArchiveChatMutation,
  useToggleSetNoticeSoundMutation,
} from "../../app/services/chat.service";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Helmet } from "react-helmet";
import ConversationBox from "../../components/chat/ConversationBox";
import {
  closeChatPage,
  openChatPage,
  setConversationReceive,
} from "../../app/slices/chat.slice";
import NewMessage from "./NewMessage";
import { useRef } from "react";
import { toast } from "react-toastify";

function Messenge() {
  const { auth } = useSelector((state) => state.auth);
  const { currentConversationId } = useSelector(
    (state) => state.currentConversationId
  );
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();
  const [tabChat, setTabChat] = useState(0);

  const { conversationReceive } = useSelector((state) => state.chat);

  const [getConversations] = useLazyGetConversationsQuery();
  const [getArchiveConversations] = useLazyGetArchiveConversationsQuery();
  const [toggleArchiveChat] = useToggleArchiveChatMutation();
  const [setSoundNotice] = useToggleSetNoticeSoundMutation();
  const [loading, setLoading] = useState(false);
  // const [currentPage, setCurrentPage] = useState(0);

  // scroll funtion ------------
  const [pageSize, setPageSize] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const loadMoreRef = useRef(null);

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1.0,
  };

  const handleIntersection = (entries) => {
    const [entry] = entries;
    if (entry.isIntersecting && !isLast && !loadingLoadMore) {
      setPageSize(conversations.length + 10);
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

  useEffect(() => {
    if (pageSize > 0) {
      const fectchData = async () => {
        try {
          setLoadingLoadMore(true);
          if (tabChat === 0) {
            let { data } = await getConversations({
              page: 0,
              pageSize: pageSize,
            });
            setConversations(data.content);
            setIsLast(data.last);
          }
          if (tabChat === 1) {
            let { data } = await getArchiveConversations({
              page: 0,
              pageSize: pageSize,
            });
            setConversations(data.content);
            setIsLast(data.last);
          }
        } catch (error) {
          console.log(error);
          toast.error("Error on page load.");
        } finally {
          setLoadingLoadMore(false);
        }
      };
      fectchData();
    }
  }, [pageSize]);

  // ---------------------------

  const handleToggleArchiveChat = (conversationId) => {
    toggleArchiveChat(conversationId)
      .unwrap()
      .then(() => {
        setConversations((oldConversations) =>
          oldConversations.filter((c) => c.conversation.id !== conversationId)
        );
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again.");
        console.log(err);
      });
  };

  const handleToggSetSoundNotice = (conversationId) => {
    setSoundNotice(conversationId)
      .unwrap()
      .then(() => {
        const newConversations = conversations.map((c) => {
          if (c.id.conversationId == conversationId) {
            console.log(c.isOnSound)
            return { ...c, isOnSound: !c.isOnSound };
          } else {
            return c;
          }
        });
        setConversations(newConversations);
      })
      .catch((err) => {
        toast.error("Something went wrong. Please try again!");
        console.log(err);
      });
  };

  useEffect(() => {
    if (currentConversationId !== 0 && conversations.length > 0) {
      const newConversations = conversations.map((c) => {
        if (c.id.conversationId == currentConversationId) {
          return { ...c, unreadCount: 0 };
        } else {
          return c;
        }
      });
      setConversations(newConversations);
    }
  }, [currentConversationId]);
  useEffect(() => {
    if (conversationReceive) {
      if (
        (!conversationReceive.isArchive && tabChat === 0) ||
        (conversationReceive.isArchive && tabChat === 1)
      )
        setConversations((oldConversations) => [
          conversationReceive,
          ...oldConversations.filter(
            (c) => c.id.conversationId !== conversationReceive.id.conversationId
          ),
        ]);
    }
  }, [conversationReceive]);

  useEffect(() => {
    dispatch(openChatPage());
    return () => {
      dispatch(closeChatPage());
      dispatch(setConversationReceive(null));
    };
  }, []);

  useEffect(() => {
    const fectchData = async () => {
      try {
        setLoading(true);
        if (tabChat === 0) {
          let { data } = await getConversations({ page: 0, pageSize: 10 });
          setConversations(data.content);
          setIsLast(data.last);
        }
        if (tabChat === 1) {
          let { data } = await getArchiveConversations({
            page: 0,
            pageSize: 10,
          });
          setConversations(data.content);
          setIsLast(data.last);
        }
      } catch (error) {
        console.log(error);
        toast.error("Error on page load.");
      } finally {
        setLoading(false);
      }
    };
    fectchData();

    return () => {
      setPageSize(0);
      setIsLast(false);
    }
  }, [tabChat]);

  return (
    <>
      <Helmet>
        <title>Direct | Hoagram</title>
      </Helmet>
      <div className="container">
        <div className="col-sm-10 offset-sm-1  messenge-container mt-4 container-chat">
          <div className="d-flex border body-chat">
            <div className="sidebar-chat border-end pt-1">
              <div className="d-flex" style={{ padding: "17px" }}>
                <span className="inbox-user-name mx-auto">{auth.name}</span>
                <NewMessage />
              </div>
              <div
                className="d-flex"
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  color: "#737373",
                }}
              >
                <div
                  role="button"
                  onClick={() => setTabChat(0)}
                  className={tabChat === 0 ? "ms-2 tabchat-show" : "ms-2"}
                >
                  Chats
                </div>
                <div
                  role="button"
                  onClick={() => setTabChat(1)}
                  className={
                    tabChat === 1 ? "ms-auto me-2 tabchat-show" : "ms-auto me-2"
                  }
                >
                  Archive
                </div>
              </div>
              <div className="conversation-list pt-2 pb-2">
                {(!loading &&
                  conversations.map((c) => (
                    <ConversationBox
                      data={c}
                      key={c.conversation.id}
                      toggleArchiveChat={handleToggleArchiveChat}
                      toggleSetSoundNotice={handleToggSetSoundNotice}
                    />
                  ))) || (
                  <div className="container">
                    <div className="text-center m-5">
                      <div className="spinner-border m-5" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
                {loadingLoadMore && (
                  <div className="container">
                    <div className="text-center m-2">
                      <div className="spinner-border m-2" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mb-2" ref={loadMoreRef}></div>
              </div>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenge;
