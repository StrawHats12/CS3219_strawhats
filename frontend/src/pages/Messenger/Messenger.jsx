import React, { useState, useEffect } from "react";

import ConversationList from "../../components/ConversationList";
import Conversation from "../../components/Conversation";
import StrawhatSpinner from "../../components/StrawhatSpinner";

import {
  getConversationByUserId,
  createConversation,
} from "../../services/messaging-service";
import { getCurrentUser } from "../../hooks/useAuth";
import useQuery from "../../hooks/useQueryParams";

import "./Messenger.css";

export default function Messages({ ...props }) {
  const curConvoMember = useQuery().get("user");
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  const [openConvo, setOpenConvo] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const curUser = await getCurrentUser();
      const curUserId = curUser.attributes.sub;
      setUserId(curUserId);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchConvos = async () => {
      const convos = await getConversationByUserId(userId);
      setConversations(convos);
      if (curConvoMember) {
        // Open convo if it exists, else create new convo
        const existingConvo = convos?.find((c) =>
          c.members.includes(curConvoMember)
        );
        if (existingConvo) {
          setOpenConvo(existingConvo);
        } else {
          const newConvo = await createConversation([curConvoMember, userId]);
          setConversations([...convos, newConvo]);
          setOpenConvo(newConvo);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    if (!userId) return;
    fetchConvos();
  }, [userId]);

  return (
    <>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <div className="messages-container">
          <ConversationList
            conversations={conversations}
            setOpenConvo={setOpenConvo}
            id={userId}
          />
          {!openConvo ? (
            <div className="empty-conversation">
              {conversations.length > 0
                ? "Select a conversation to start talking!"
                : "You have no ongoing conversations."}
            </div>
          ) : (
            <Conversation convo={openConvo} id={userId} />
          )}
        </div>
      )}
    </>
  );
}
