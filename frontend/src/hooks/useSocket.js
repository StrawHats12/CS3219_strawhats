import { useEffect, useState } from "react";
import io from "socket.io-client";
import { MESSAGING_SOCKET_ENDPOINT } from "../const";

const useSocket = ({ id }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(MESSAGING_SOCKET_ENDPOINT, { query: { id } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return { socket };
};

export default useSocket;
