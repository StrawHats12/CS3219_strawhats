import { fetchPublicStreamDetails } from "../../services/livestream-service";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";
import { LIVESTREAM_SOCKET_ENDPOINT } from "../../const";
import useSocket from "../../hooks/useSocket";

// todo: change to stream controls element which can create, delete streams
const ViewerControlPanel = (props) => {
  const { streamerId } = props;
  const [playbackIds, setPlaybackIds] = useState([]);
  const { socket } = useSocket(
    streamerId,
    "/socket.io",
    LIVESTREAM_SOCKET_ENDPOINT
  );

  useEffect(() => {
    const run = async () => {
      console.log("CALLED");
      const response = await fetchPublicStreamDetails(streamerId).catch((e) => {
        console.error(e.toString());
        return;
      });

      if (response) {
        const { playback_ids } = response;
        setPlaybackIds(playback_ids);
      } else {
        socket.on("stream_update", () => {
          socket.off("stream_update");
          run();
        });
      }
    };
    if (socket) {
      run();
    }

    return () => socket && socket.off("stream_update");
  }, [socket, streamerId]);

  return (
    <Container>
      <StreamViewer playbackIds={playbackIds} />
    </Container>
  );
};
export default ViewerControlPanel;
