import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import useAuth from "../../hooks/useAuth";

const Admin = () => {
  const auth = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const groups =
      auth?.currentUser?.signInUserSession?.idToken?.payload["cognito:groups"];
    if (groups && "strawhats-admin" in groups) {
      setIsAdmin(true);
    }
  }, [auth]);

  if (!isAdmin) {
    return (
      <h3 className="pt-5 text-center">
        You need to be an admin to view this page
      </h3>
    );
  }

  return <Container></Container>;
};

export default Admin;
