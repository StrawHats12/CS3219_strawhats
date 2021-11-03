import { useEffect, useState } from "react";
import io from "socket.io-client";
import { DEPLOYED } from "../const";

const useSocket = (id, deployedPath, endpoint) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    const path = DEPLOYED ? deployedPath : "/socket.io";
    const newSocket = io.connect(endpoint, {
      path: path,
      query: { id },
      upgrade: false,
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [deployedPath, endpoint, id]);

  return { socket };
};

export default useSocket;
