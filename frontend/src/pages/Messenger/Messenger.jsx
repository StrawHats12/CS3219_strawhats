import Storage from "@aws-amplify/storage";
import React, { useState, useEffect } from "react";

import ConversationList from "../../components/ConversationList";
import Conversation from "../../components/Conversation";
import StrawhatSpinner from "../../components/StrawhatSpinner";

import {
  getConversationByUser,
  createConversation,
} from "../../services/messaging-service";
import { getAccount } from "../../services/account-service";
import { getCurrentUser } from "../../hooks/useAuth";
import useQuery from "../../hooks/useQueryParams";

import "./Messenger.css";

export default function Messages() {
  const curConvoMember = useQuery().get("user");

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [openConvo, setOpenConvo] = useState(null);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const curUser = await getCurrentUser();
      getAccount(curUser.username).then((acc) => setUser(acc));
      getAccount(curUser.username).then((user) => {
        setUser(user);
        if (user.image && user.uid) {
          Storage.get(user.image, {
            level: "protected",
            identityId: user.uid,
          }).then((image) => {
            setUser({ ...user, image });
          });
        }
      });
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchConvos = async () => {
      const convos = await getConversationByUser(user.username);
      setConversations(convos);
      if (curConvoMember) {
        // Open convo if it exists, else create new convo
        const existingConvo = convos?.find((c) =>
          c.members.includes(curConvoMember)
        );
        if (existingConvo) {
          setOpenConvo(existingConvo);
        } else {
          const newConvo = await createConversation([
            curConvoMember,
            user.username,
          ]);
          setConversations([...convos, newConvo]);
          setOpenConvo(newConvo);
        }
      }
    };
    if (!user || !isLoading) return;
    fetchConvos();
    setIsLoading(false);
  }, [user]);

  return (
    <>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <div className="messages-container">
          <ConversationList
            conversations={conversations}
            setOpenConvo={setOpenConvo}
            username={user.username}
          />
          {!openConvo ? (
            <div className="empty-conversation">
              {conversations.length > 0
                ? "Select a conversation to start talking!"
                : "You have no ongoing conversations."}
            </div>
          ) : (
            <Conversation convo={openConvo} user={user} />
          )}
        </div>
      )}
    </>
  );
}
