import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MESSAGING_SOCKET_ENDPOINT,
  LIVESTREAM_SOCKET_ENDPOINT,
} from "../const";

const useSocket = ({ id, isLivestreamChat }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io.connect(
      isLivestreamChat ? LIVESTREAM_SOCKET_ENDPOINT : MESSAGING_SOCKET_ENDPOINT,
      { query: { id }, upgrade: false }
    );
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return { socket };
};

export default useSocket;
