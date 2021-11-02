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
    <div className="sign-out-container">
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <center>
        <h1>Hello {currentUser.username},</h1>
        <span class="material-icons">
          logout
        </span>
        <h2>Are you sure you want to sign out?</h2>
        <AmplifySignOut />
      </center>
    </div>
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
