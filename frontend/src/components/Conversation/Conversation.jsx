import React, { useState, useCallback, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";

import StrawhatSpinner from "../../components/StrawhatSpinner";

import {
  sendMessage,
  getMessagesByConvoId,
} from "../../services/messaging-service";
import useSocket from "../../hooks/useSocket";

import Message from "./Message";
import "./Conversation.css";

export default function Conversation({ convo, username: id }) {
  const { socket } = useSocket({ id });
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  useEffect(() => {
    if (!convo) return;
    const getMessages = async () => {
      try {
        const res = await getMessagesByConvoId(convo.id);
        // Temp sorting
        res.sort((a, b) => a.created_at - b.created_at);
        setMessages(res);
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    getMessages();
  }, [convo]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    const newMsg = {
      sender_id: id,
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
            You are currently chatting with{" "}
            {convo.members.find((m) => m !== id)}
          </div>
          <div className="conversation-messages-container">
            {messages.map((m, index) => {
              const isLastMessage = messages.length - 1 === index;
              return (
                <Message
                  message={m}
                  isLastMessage={isLastMessage}
                  id={id}
                  setRef={setRef}
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
                <Button type="submit">Send</Button>
              </InputGroup>
            </Form.Group>
          </Form>
        </>
      )}
    </div>
  );
}
