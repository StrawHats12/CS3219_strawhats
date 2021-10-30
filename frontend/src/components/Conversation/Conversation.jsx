import Storage from "@aws-amplify/storage";
import React, { useState, useCallback, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

import StrawhatSpinner from "../../components/StrawhatSpinner";
import PlaceholderProfileImage from "../Profile/placeholderProfileImage.jpg";

import {
  sendMessage,
  getMessagesByConvoId,
} from "../../services/messaging-service";
import { getAccount } from "../../services/account-service";
import useSocket from "../../hooks/useSocket";

import Message from "./Message";
import "./Conversation.css";

export default function Conversation({ convo, user }) {
  const { socket } = useSocket({ id: user.username });
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  useEffect(() => {
    if (!convo) return;
    const getData = async () => {
      try {
        await getAccount(convo.members.find((m) => m !== user.username)).then(
          (otherUser) => {
            setOtherUser(otherUser);
            if (otherUser.image && otherUser.uid) {
              Storage.get(otherUser.image, {
                level: "protected",
                identityId: otherUser.uid,
              }).then((image) => {
                setOtherUser({ ...otherUser, image });
              });
            }
          }
        );

        const res = await getMessagesByConvoId(convo.id);
        // Temp sorting
        res.sort((a, b) => a.created_at - b.created_at);
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    getData();
  }, [convo, user]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    const newMsg = {
      sender_id: user.username,
      conversation_id: convo.id,
      text,
      recipients: convo.members,
    };
    socket.emit("send-message", newMsg);
    sendMessage(newMsg);
    addMessageToConversation(newMsg);
    setText("");
  }

  const addMessageToConversation = useCallback(
    (msg) => {
      if (msg.conversation_id !== convo.id) return;
      setMessages([...messages, msg]);
    },
    [convo.id, messages]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", addMessageToConversation);
    return () => socket.off("receive-message");
  }, [addMessageToConversation, socket]);

  return (
    <div className="conversation-container">
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <>
          <div className="conversation-header">
            <img
              src={otherUser.image ?? PlaceholderProfileImage}
              alt=""
              style={{
                width: 30,
                height: 30,
                objectFit: "cover",
                marginRight: 5,
              }}
            />
            {otherUser.username}
          </div>
          <div className="conversation-messages-container">
            {messages.map((m, index) => {
              const isLastMessage = messages.length - 1 === index;
              return (
                <Message
                  message={m}
                  isLastMessage={isLastMessage}
                  isYourMessage={m.sender_id === user.username}
                  sender={m.sender_id === user.username ? user : otherUser}
                  setRef={setRef}
                  key={m.id}
                />
              );
            })}
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="m-2">
              <InputGroup>
                <Form.Control
                  className="chat-input"
                  type="text"
                  placeholder="Enter your message here"
                  required
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <Button
                  type="submit"
                  style={{ background: "#384d9d", border: "none" }}
                >
                  Send
                </Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </>
      )}
    </div>
  );
}
