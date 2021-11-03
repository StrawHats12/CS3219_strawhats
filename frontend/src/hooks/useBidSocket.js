import { useEffect, useState } from "react";
import io from "socket.io-client";
import { BIDDING_SOCKET_ENDPOINT, DEPLOYED } from "../const";

const useBidSocket = ({ listingId }) => {
  const [socket, setSocket] = useState();
  useEffect(() => {
    const path = DEPLOYED ? "/bid/socket.io" : "/socket.io";
    const newSocket = io.connect(BIDDING_SOCKET_ENDPOINT, {
      path: path,
      query: { listingId },
      upgrade: false,
    });
    console.log(newSocket);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [listingId]);

  return { socket };
};

export default useBidSocket;
