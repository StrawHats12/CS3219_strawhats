import React from "react";
import { ListGroup } from "react-bootstrap";

export default function ConversationList({
  conversations,
  setOpenConvo,
  username,
}) {
  return (
    <div style={{ width: 200 }}>
      <ListGroup variant="flush">
        {conversations.map((c, index) => (
          <ListGroup.Item
            key={index}
            action
            onClick={() => {
              setOpenConvo(c);
            }}
          >
            {c.members?.find((m) => m !== username)}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
