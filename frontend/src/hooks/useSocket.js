import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MESSAGING_SOCKET_ENDPOINT,
  LIVESTREAM_SOCKET_ENDPOINT,
  DEPLOYED,
} from "../const";

const useSocket = ({ id, isLivestreamChat }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const path = DEPLOYED ? "/messaging/socket.io" : "/socket.io";
    const newSocket = io.connect(
      isLivestreamChat ? LIVESTREAM_SOCKET_ENDPOINT : MESSAGING_SOCKET_ENDPOINT,
      { path: path, query: { id }, upgrade: false }
    );

    setSocket(newSocket);

    return () => newSocket.close();
  }, [id, isLivestreamChat]);

  return { socket };
};

export default useSocket;
