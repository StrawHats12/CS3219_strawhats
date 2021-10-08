import React from "react";
import {
  AmplifyAuthenticator,
  AmplifyContainer,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import { Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const Authentication = () => {
  const { currentUser } = useAuth();

  return currentUser ? (
    <Container>
      <div>Hello {currentUser.username},</div>
      <div>Are you sure you want to sign out?</div>
      <AmplifySignOut />
    </Container>
  ) : (
    <AmplifyContainer>
      <AmplifyAuthenticator>
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            { type: "username" },
            { type: "password" },
            { type: "email" },
          ]}
        />
      </AmplifyAuthenticator>
    </AmplifyContainer>
  );
};

export default Authentication;
