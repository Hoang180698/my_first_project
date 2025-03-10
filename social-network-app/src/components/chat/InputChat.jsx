import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import "./init";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import { useEffect } from "react";
import { stompClient } from "../header/Header";
import TimerBar from "./TimerBar";
import AudioPlayer from "./AudioPlayer";

function InputChat({ conversationId }) {
  const { token } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const [isRecording, setIsRecording] = useState(0);
  const [audioURL, setAudioURL] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mediaStreamRef = useRef(null);
  const [timeCount, setTimeCount] = useState(0);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    setIsRecording(1);
    mediaStreamRef.current = stream;
    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data)
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/ogg" });
      console.log(audioBlob);
      const audioURL = URL.createObjectURL(audioBlob);
      setAudioURL(audioURL);
    };

    mediaRecorderRef.current.start();
  };

  const stopRecording = (timeCount) => {
    if(audioChunksRef.current) {
      setIsRecording(2);
    }   
    setTimeCount(timeCount);
    mediaRecorderRef.current.stop();
    mediaStreamRef.current.getTracks().forEach((track) => track.stop());
  };

  const startRecord = async () => {
    startRecording();
  };

  const stopRecord = () => {
    // setAudioURL("");
    setIsRecording(0);
    audioChunksRef.current = [];
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }

  useEffect(() => {
    setContent("");
    stopRecord();
  }, [conversationId]);

  const handleSendVoice = () => {
    if(audioChunksRef.current) {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/ogg" });
      // const file = new File(audioChunksRef.current, "audio.mp3", {type: audioBlob.type, lastModified: Date.now()})
      // console.log(file)
      var reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.toString().split(",")[1];
        const newMessage = { content: base64String };
        stompClient.send(
          "/app/message/send-voice/" + conversationId,
          {},
          JSON.stringify(newMessage)
        );
      };
      reader.readAsDataURL(audioBlob);

      stopRecord();
    }
  
  }

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

  const onEmojiClick = (e) => {
    setContent((prevInput) => prevInput + e.emoji);
  };

  const handleSendMessage = () => {
    if (content.length === 0) {
      return;
    }
    const newMessage = { content: content };
    stompClient.send(
      "/app/message/" + conversationId,
      { Authorization: `Bearer ${token}` },
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

  const handleSendImage = (e) => {
    const files = Array.from(e.target.files);
    if (files) {
      files.map((file) => {
        var reader = new FileReader();
        reader.onload = () => {
          const rawData = reader.result.toString();
          const newMessage = { content: rawData };
          stompClient.send(
            "/app/message/send-image/" + conversationId,
            { Authorization: `Bearer ${token}` },
            JSON.stringify(newMessage)
          );
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <>
      {isRecording !== 0 &&  (
        <div className="input-message mx-auto mt-auto mb-3 d-flex border">
          <div className="d-flex align-items-center me-2">
            <span
              onClick={() => stopRecord()}
              className="photo-video text-center my-auto ms-3"
            >
              <i className="fa-solid fa-circle-xmark" style={{color:"#3399FF"}}></i>
            </span>
          </div>
          {isRecording === 1 && <TimerBar stopRecord={stopRecording} />} 
          {(isRecording === 2 && audioURL) && <AudioPlayer audioUrl={audioURL} preDuration={timeCount}/>}
          <button
            className="btn btn-post-comment btn-block me-2"
            onClick={handleSendVoice}
          >
            Send
          </button>
        </div>
      )}

      {isRecording === 0 && (
        <div className="input-message mx-auto mt-auto mb-3 d-flex border position-relative">
          {!content && (
            <>
              <span
                onClick={() => startRecord()}
                className="photo-video text-center my-auto ms-3"
              >
                <i className="fa-solid fa-microphone"></i>
              </span>
              <label
                htmlFor="chat-image"
                className="photo-video text-center my-auto ms-2"
              >
                <i className="fa-regular fa-image"></i>
              </label>
              <input
                className="d-none"
                id="chat-image"
                onChange={(e) => handleSendImage(e)}
                type="file"
                multiple
                accept="image/png, image/gif, image/jpeg, image/jpg"
              ></input>
            </>
          )}

          <a
            role="button"
            className="ms-2 my-auto"
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
                emojiStyle="native"
                autoFocusSearch={false}
              />
            </div>
          )}
          <button
            className="btn btn-post-comment btn-block me-2"
            onClick={handleSendMessage}
            disabled={!content}
          >
            Send
          </button>
        </div>
      )}
    </>
  );
}

export default InputChat;
