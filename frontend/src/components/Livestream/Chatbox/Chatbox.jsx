import React, { useState, useCallback, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { getCurrentUser } from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";

import ChatboxMessage from "./ChatboxMessage";
import "./Chatbox.css";
import { LIVESTREAM_SOCKET_ENDPOINT } from "../../../const";

export default function Chatbox({ livestreamId }) {
  const { socket } = useSocket(
    livestreamId,
    "/livestream/socket.io",
    LIVESTREAM_SOCKET_ENDPOINT
  );
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [curUsername, setCurUsername] = useState("");

  const setRef = useCallback((node) => {
    if (node) {
      node.scrollIntoView({ smooth: true });
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const curUser = await getCurrentUser();
      if (!curUser) return;
      setCurUsername(curUser.username);
    };
    fetchUser();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!text) return;
    const newMsg = {
      sender_id: curUsername,
      livestream_id: livestreamId,
      text,
    };
    socket.emit("send-message", newMsg);
    addMessageToConversation(newMsg);
    setText("");
  }

  const addMessageToConversation = useCallback(
    (msg) => {
      if (msg.livestream_id !== livestreamId) return;
      setMessages([...messages, msg]);
    },
    [livestreamId, messages]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-message", addMessageToConversation);
    return () => socket.off("receive-message");
  }, [addMessageToConversation, socket]);

  return (
    <div className="stream-chat-container">
      <div className="stream-messages-container">
        {messages.map((m, index) => {
          const isLastMessage = messages.length - 1 === index;
          return (
            <ChatboxMessage
              message={m}
              isLastMessage={isLastMessage}
              setRef={setRef}
              key={livestreamId + index}
            />
          );
        })}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="m-2">
          <InputGroup>
            <Form.Control
              className="stream-chat-input"
              type="text"
              placeholder="Chat in the livestream now!"
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
    </div>
  );
}
