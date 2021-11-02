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
    <>
      {isYourMessage ? (
        <div
          ref={isLastMessage ? setRef : null}
          key={message._id}
          className={`message-container message-container-own`}
        >
          <div
            className={`message-text-container message-text-container-own
            `}
          >
            {message.text}
          </div>
          <Image
            src={sender.image ?? PlaceholderProfileImage}
            roundedCircle
            style={{ width: 30, height: 30, objectFit: "cover", margin: 5 }}
          />
        </div>
      ) : (
        <div
          ref={isLastMessage ? setRef : null}
          key={message._id}
          className={`message-container`}
        >
          <Image
            src={sender.image ?? PlaceholderProfileImage}
            roundedCircle
            style={{ width: 30, height: 30, objectFit: "cover", margin: 5 }}
          />
          <div className={`message-text-container`}>{message.text}</div>
        </div>
      )}
    </>
  );
}
