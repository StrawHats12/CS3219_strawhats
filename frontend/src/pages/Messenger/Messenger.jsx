import React, { useState, useEffect } from "react";

import ConversationList from "../../components/ConversationList";
import Conversation from "../../components/Conversation";

import { getConversationByUserId } from "../../services/messaging-service";

import "./Messenger.css";

export default function Messages({ ...props }) {
  const id = props.match.params.id;
  const [openConvo, setOpenConvo] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConvos = async () => {
      const res = await getConversationByUserId(id);
      setConversations(res);
    };
    fetchConvos();
  }, [id]);

  return (
    <div className="messages-container">
      <ConversationList
        conversations={conversations}
        setOpenConvo={setOpenConvo}
        id={id}
      />
      {!openConvo ? (
        <div className="empty-conversation">
          Select a conversation to start talking!
        </div>
      ) : (
        <Conversation convo={openConvo} id={id} />
      )}
    </div>
  );
}
