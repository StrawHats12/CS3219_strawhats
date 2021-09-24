import Auth from "@aws-amplify/auth";
import { Hub } from "@aws-amplify/core";
import { useEffect, useState } from "react";

/*
  Hook adapted from https://github.com/aws-amplify/amplify-js/issues/3640#issuecomment-916403908
*/

const getCurrentUser = async () => {
  try {
    return await Auth.currentAuthenticatedUser();
  } catch {
    return null;
  }
};

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const updateUser = async () => {
      setCurrentUser(await getCurrentUser());
    };
    Hub.listen("auth", updateUser);
    updateUser();
    return () => Hub.remove("auth", updateUser);
  }, []);

  return { currentUser };
};

export default useAuth;

export { getCurrentUser };
