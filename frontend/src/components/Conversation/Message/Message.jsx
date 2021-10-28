import React from "react";
import "./Message.css";

export default function Message({ message, isLastMessage, setRef, id }) {
  return (
    <div
      ref={isLastMessage ? setRef : null}
      key={message._id}
      className={`message-container ${
        message.sender_id === id && "message-container-own"
      }`}
    >
      <div
        className={`message-text-container ${
          message.sender_id === id && "message-text-container-own"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
