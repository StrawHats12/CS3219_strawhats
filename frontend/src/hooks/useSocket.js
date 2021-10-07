import { useEffect, useState } from "react";
import io from "socket.io-client";
import Config from "../config.json";

const SOCKET_URL = Config.SOCKET_URL;

const useSocket = ({ id }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const newSocket = io(SOCKET_URL, { query: { id } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return { socket };
};

export default useSocket;
