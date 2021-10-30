import React from "react";
import { Card, ListGroup } from "react-bootstrap";

export default function ConversationList({
  conversations,
  setOpenConvo,
  username,
}) {
  return (
    <Card style={{ width: "200px" }}>
      <Card.Header as="h5">Conversation List</Card.Header>
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
    </Card>
  );
}
