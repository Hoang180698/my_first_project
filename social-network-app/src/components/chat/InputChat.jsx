import React, { useState } from "react";
import { useSelector } from "react-redux";
import TextareaAutosize from "react-textarea-autosize";
import "./init";
import EmojiPicker from "emoji-picker-react";
import { useRef } from "react";
import { useEffect } from "react";


function InputChat({ conversationId, stompClient }) {
  const { token } = useSelector((state) => state.auth);

  const [content, setContent] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const emojiRef = useRef(null);
  const emojiButtonRef = useRef(null);

  useEffect(() => {
    setContent("");
  },[conversationId])

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

  const handleSendImage = (file) => {
    var reader = new FileReader();
    let rawData = new ArrayBuffer();
    reader.onload = (e) => {
        rawData = e.target.result;
        stompClient.send("/app/message/send-image/" + conversationId,  { Authorization: `Bearer ${token}` }, 
        JSON.stringify({ data: e.target.result }))
    };
    reader.readAsArrayBuffer(file.target.files[0]);

    // reader.readAsArrayBuffer(file);
    // const reader = new FileReader();
    // let rawData = new ArrayBuffer();
    // rawData = e.target.files[0];
    // const bufferData = Buffer.from(rawData);
    // const bsonData = serialize({  // whatever js Object you need
    //   file: bufferData,
    //   route: 'TRANSFER',
    //   action: 'FILE_UPLOAD',
    // });
    // stompClient.send(
    //   "/app/message/send-image/" + conversationId,
    //   { Authorization: `Bearer ${token}` },
    //   bsonData
    // );
  }


  return (
    <div className="input-message mx-auto mt-auto mb-3 d-flex border position-relative">
      <a
        role="button"
        className="ms-3 my-auto"
        onClick={() => setShowPicker(true)}
        ref={emojiButtonRef}
      >
        <i className="fa-sharp fa-regular fa-face-smile"></i>
      </a>
      <input onChange={(e) => handleSendImage(e)} type="file"></input>
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
      >
        Send
      </button>
    </div>
  );
}

export default InputChat;
