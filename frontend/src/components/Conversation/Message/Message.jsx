import React from "react";
import { Image } from "react-bootstrap";
import PlaceholderProfileImage from "../../Profile/placeholderProfileImage.jpg";

import "./Message.css";

export default function Message({
  message,
  isLastMessage,
  setRef,
  isYourMessage,
  sender,
}) {
  return (
    <div
      ref={isLastMessage ? setRef : null}
      key={message._id}
      className={`message-container ${
        isYourMessage && "message-container-own"
      }`}
    >
      <Image
        src={sender.image ?? PlaceholderProfileImage}
        roundedCircle
        style={{ width: 30, height: 30, objectFit: "cover", margin: 5 }}
      />
      <div
        className={`message-text-container ${
          isYourMessage && "message-text-container-own"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}
