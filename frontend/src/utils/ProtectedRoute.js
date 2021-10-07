import React, { useLayoutEffect, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import StrawhatSpinner from "../components/StrawhatSpinner";
import { getCurrentUser } from "../hooks/useAuth";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    async function getAuthenticationStatus() {
      const currentUser = await getCurrentUser();
      if (currentUser != null) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
    getAuthenticationStatus();
  }, []);

  return (
    <Route
      {...restOfProps}
      render={(props) =>
        isLoading ? (
          <StrawhatSpinner />
        ) : isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to="/authentication" />
        )
      }
    />
  );
}

export default ProtectedRoute;
