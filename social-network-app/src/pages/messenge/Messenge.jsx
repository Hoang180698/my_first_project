import React from "react";
import "./chat.css";
import TextareaAutosize from "react-textarea-autosize";
import InputChat from "../../components/chat/InputChat";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useGetContactsQuery, useLazyGetContactsQuery } from "../../app/services/chat.service";
import { useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import NewMessage from "./NewMessage";
import { Helmet } from "react-helmet";
import { formatDate, formatDateTime } from "../../utils/functionUtils";

var stompClient = null;
function Messenge() {
  const { auth } = useSelector((state) => state.auth);
  const [contacts, setContacts] = useState([]);


  const [isConnected, setIsConnected] = useState(false);
  const [getContacts] = useLazyGetContactsQuery();
  // const { data, isLoading } = useGetContactsQuery();

  // useEffect(() => {
  //   if(!data) {
  //     return;
  //   }
  //   setContacts(data);
  // }, [data])

  useEffect(() => {
    const fectchData = async () => {
      try {
        let { data } = await getContacts();
        setContacts(data);
      } catch (error) {
        console.log(error)
      }
     
    };
    if (isConnected) {
      stompClient.disconnect();
      setIsConnected(false);
    }
    fectchData();
    connect();

    return () => {
      onDisconnect();
    };
  }, []);

  const onConnected = () => {
    setIsConnected(true);
    stompClient.subscribe(
      "/topic/user/" + auth.id,
      onMessageReceived
    );
  };

  const onDisconnect = () => {
    if (isConnected) {
      stompClient.disconnect();
      setIsConnected(false);
    }
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    setContacts((oldContacts) => [payloadData, ...oldContacts.filter((c) => c.id !== payloadData.id)]);
  };

  const onError = (err) => {
    console.log(err);
  };
  const connect = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

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
              {contacts.map((c) => (
                <NavLink
                  className="px-3 py-2 d-flex user-chat-box text-dark"
                  to={`/messenge/inbox/${c.id}`}
                  key={c.id}
                >
                  <img
                    src={
                      c.user1.id === auth.id
                        ? c.user2.avatar
                          ? `http://localhost:8080${c.user2.avatar}`
                          : "../../../public/user.jpg"
                        : c.user1.avatar
                        ? `http://localhost:8080${c.user1.avatar}`
                        : "../../../public/user.jpg"
                    }
                    className="avatar-chat"
                  />
                  <div className="px-2 d-flex flex-column" style={{maxWidth:"75%"}}>
                    <span className="mt-1 chat-user-name" style={{fontWeight:"500"}}>
                      {c.user1.id === auth.id ? c.user2.name : c.user1.name}
                    </span>
                    
                    <span className="last-message mt-0">
                      {c.lastMessage?.sender.id === auth.id && <b>you: </b>}
                      {c.lastMessage?.content}
                    </span>
                    <p role="button" className="mb-0 text-muted time-post">
                  {formatDate(c.lastMessage?.createdAt)}
                </p>
                  </div>
                
                </NavLink>
              ))}
            </div>
            <Outlet />
            {/* <div className="d-flex flex-column conversation-container">
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
                      className={
                        m.sender.id === auth.id ? "ms-auto" : "me-auto border"
                      }
                    >
                      {m.content}
                    </p>
                  </div>
                ))}
              </div>
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
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Messenge;
