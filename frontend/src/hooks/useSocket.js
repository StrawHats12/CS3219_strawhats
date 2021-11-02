import { useEffect, useState } from "react";
import io from "socket.io-client";
import {
  MESSAGING_SOCKET_ENDPOINT,
  LIVESTREAM_SOCKET_ENDPOINT,
  BIDDING_ENDPOINT
} from "../const";

const useSocket = ({ id, serviceDeterminant }) => {
  const [socket, setSocket] = useState();

  useEffect(() => {
    var serviceEndpoint = "";

    if (serviceDeterminant === "LIVESTREAM") {
      serviceEndpoint = LIVESTREAM_SOCKET_ENDPOINT;
    } else if (serviceDeterminant === "MESSAGE") {
      serviceEndpoint = MESSAGING_SOCKET_ENDPOINT;
    } else if (serviceDeterminant === "BIDDING") {
      serviceEndpoint = BIDDING_ENDPOINT
    }

    const newSocket = io.connect(serviceEndpoint,
      { query: { id } }
    );
    setSocket(newSocket);

    return () => newSocket.close();
  }, [id]);

  return { socket };
};

export default useSocket;
