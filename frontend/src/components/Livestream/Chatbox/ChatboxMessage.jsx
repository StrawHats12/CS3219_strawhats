import React from "react";

import "./ChatboxMessage.css";

export default function ChatboxMessage({ message, isLastMessage, setRef }) {
  console.log(message);
  return (
    <div
      ref={isLastMessage ? setRef : null}
      key={message._id}
      className={`stream-message-container`}
    >
      <div className={`stream-message-sender`}>{message.sender_id}</div>
      {message.text}
    </div>
  );
}
