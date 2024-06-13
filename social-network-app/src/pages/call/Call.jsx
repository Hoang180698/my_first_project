import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useBeforeUnload, useNavigate, useParams } from "react-router-dom";
import { baseUrl } from "../../App";
import { useLazyGetCallTokkenQuery } from "../../app/services/chat.service";
import joinCallSound from "../../assets/sound/joincall.mp3";
import leaveCallSound from "../../assets/sound/leave-call.mp3"
import Loading3dot from "../../components/loading/Loading3dot";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import { getDataFromLocalStorage } from "../../utils/localStorageUtils";


const appID = 207536523;
// const server = "ff6b45ea1ebbf717ab573963b78226ce";
var stompClients = null;

function Call() {
  const { conversationId } = useParams();
  const [getToken] = useLazyGetCallTokkenQuery();
  const { auth } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [callToken, setCallToken] = useState("");

  const token = getDataFromLocalStorage("authSnw")?.token;
  useBeforeUnload(() => {
    "Are you sure to close this tab?"
  })
  
  useEffect(() => {
    onDisconnect();
    connect();

    return () => {
      onDisconnect();
    };
  }, [conversationId]);

  const connect = () => {
    let Sock = new SockJS(`${baseUrl}/ws`);
    stompClients = over(Sock);
    // stompClient.debug = () => {};
    stompClients.connect(
      { Authorization: `Bearer ${token}` },
      () =>{},
      onError
    );
  };

  const onDisconnect = () => {
    if (stompClients?.connected === true) {
      stompClients?.disconnect();
    }
  };

  const onError = (err) => {
    console.log(err);
    navigate("/")
  };

  useEffect(() => {
    // const timeStamp = Math.round(Date.now()/1000);

    getToken(conversationId).unwrap()
    .then((res) => {
      setCallToken(res.token); 
    }).catch((e) => {
      navigate("/");
    });
  }, []);
     
  useEffect(() => {
    const unloadCallback = (event) => {
      stompClients.send(
        "/app/call/leave/" + conversationId,
        null,
        null
      );
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
  
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  const meeting = async (element) => {
    if(callToken) {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
        appID,
        callToken,
        conversationId,
        `${auth.id}${auth.avatar ? auth.avatar.replaceAll("/", "_") : ""}`,
        auth.name
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        showPreJoinView: false,
        turnOnCameraWhenJoining: false,
        showRoomDetailsButton: false,
        onUserAvatarSetter: (userList) => {
          userList.forEach((user) => {
            let avatarId = user.userID.substring(user.userID.lastIndexOf("_") + 1);
            if(avatarId) {
              user.setUserAvatar(`${baseUrl}/api/images/read/${avatarId}`);
            } 
            if(user.userID.lastIndexOf("_") < 0) {
              user.setUserAvatar("https://iili.io/JyQkiYu.jpg");
            }
          });
        },
        onUserJoin: (userList) => {
          const joinSound = new Audio(joinCallSound);
          userList.forEach((user) => {
            joinSound.play();
          });
        },
        onUserLeave: (userList) => {
          const leaveSound = new Audio(leaveCallSound);
          userList.forEach((user) => {
            leaveSound.play();
          });
        },
        onJoinRoom: () => {
          stompClients.send(
            "/app/call/join/" + conversationId,
            null,
            null)
        },
        onLeaveRoom: () => {
          stompClients.send(
            "/app/call/leave/" + conversationId,
            null,
            null
          );
        }
      });
    }  
  };

  return (
    <>
      {!callToken && <div className="d-flex align-items-center justify-content-center" style={{ width: "100vw", height: "100vh" }}>
        <Loading3dot />
        </div>}
      <div
        ref={meeting}
        style={{ width: "100vw", height: "100vh" }}
      ></div>
    </>
  );
}

export default Call;
