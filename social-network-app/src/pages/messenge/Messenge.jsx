import React, { useRef } from "react";
import "./chat.css";
import TextareaAutosize from "react-textarea-autosize";
import InputChat from "../../components/chat/InputChat";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
} from "../../app/services/chat.service";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import NewMessage from "./NewMessage";
import { Helmet } from "react-helmet";
import { formatDate, formatDateTime } from "../../utils/functionUtils";
import ConversationBox from "../../components/chat/ConversationBox";
import { closeChatPage, openChatPage, setConversationReceive } from "../../app/slices/chat.slice";

var stompClient = null;
function Messenge() {
  const { auth } = useSelector((state) => state.auth);
  const { currentConversationId } = useSelector(
    (state) => state.currentConversationId
  );
  const [conversations, setConversations] = useState([]);
  const dispatch = useDispatch();

  const { conversationReceive } = useSelector((state) => state.chat);

  const [isConnected, setIsConnected] = useState(false);
  const [getConversations] = useLazyGetConversationsQuery();

  const effect = useRef(false);
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
    const fectchData = async () => {
      try {
        let { data } = await getConversations();
        setConversations(data);
      } catch (error) {
        console.log(error);
      }
    };
    fectchData();
    return () => {
      dispatch(closeChatPage());
      dispatch(setConversationReceive(null));
    };
  }, []);

  // useEffect(() => {
  //   const fectchData = async () => {
  //     try {
  //       let { data } = await getConversations();
  //       setConversations(data);
  //     } catch (error) {
  //       console.log(error)
  //     }

  //   };
  //   fectchData();
  //   if(effect.current === true) {
  //     connect();
  //     effect.current = true;
  //   }

  //   return () => {
  //     onDisconnect();
  //     effect.current = true;
  //   };
  // }, []);

  // const onConnected = () => {
  //   setIsConnected(true);
  //   stompClient.subscribe(
  //     "/topic/user/" + auth.id,
  //     onMessageReceived
  //   );
  // };

  // const onDisconnect = () => {
  //   if (isConnected) {
  //     stompClient.disconnect();
  //     setIsConnected(false);
  //   }
  // };

  // const onMessageReceived = (payload) => {
  //   const payloadData = JSON.parse(payload.body);
  //   console.log(payloadData);
  //   setConversations((oldConversations) => [payloadData, ...oldConversations.filter((c) => c.id.conversationId !== payloadData.id.conversationId)]);
  // };

  // const onError = (err) => {
  //   console.log(err);
  // };
  // const connect = () => {
  //   let Sock = new SockJS("http://localhost:8080/ws");
  //   stompClient = over(Sock);
  //   stompClient.connect({}, onConnected, onError);
  // };

  // if (isLoading) {
  //   return (
  //     <div className="container">
  //       <div className="text-center m-5">
  //         <div className="spinner-border m-5" role="status">
  //           <span className="sr-only">Loading...</span>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
      <Helmet>
        <title>Direct | Hoagram</title>
      </Helmet>
      <div className="container">
        <div className="col-sm-10 offset-sm-1  messenge-container mt-4 container-chat">
          <div className="d-flex border body-chat">
            <div className="sidebar-chat border-end pt-1">
              <div className="border-bottom mb-2 p-3 d-flex">
                <span className="inbox-user-name mx-auto">{auth.name}</span>
                <NewMessage />
              </div>
              {conversations.map((c) => (
                <ConversationBox data={c} key={c.conversation.id} />
              ))}
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenge;
