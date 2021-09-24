import React from "react";
import {
  AmplifyAuthenticator,
  AmplifyContainer,
  AmplifySignOut,
  AmplifySignUp,
} from "@aws-amplify/ui-react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import { Container } from "react-bootstrap";

const Authentication = () => {
  const [authState, setAuthState] = React.useState();
  const [user, setUser] = React.useState();

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <Container>
      <div>Hello {user.username},</div>
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
