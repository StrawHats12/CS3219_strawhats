import { fetchPublicStreamDetails } from "../../services/livestream-service";
import { ButtonGroup, Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";
import { LIVESTREAM_SOCKET_ENDPOINT } from "../../const";
import useSocket from "../../hooks/useSocket";
import { GoMute, GoUnmute } from "react-icons/all";

const ViewerControlPanel = (props) => {
  const { streamerId } = props;
  const [playbackIds, setPlaybackIds] = useState([]);
  const volume = 0.6;
  const [muted, setMuted] = useState(false);
  const { socket } = useSocket(
    streamerId,
    "/livestream/socket.io",
    LIVESTREAM_SOCKET_ENDPOINT
  );

  const toggleMute = () => {
    setMuted(!muted);
  };

  useEffect(() => {
    if (!streamerId) {
      return;
    }

    const run = async () => {
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

  const muteToggler = (
    <>
      {muted ? (
        <GoUnmute onClick={toggleMute} />
      ) : (
        <GoMute onClick={toggleMute} />
      )}
    </>
  );

  if (!streamerId) {
    return <></>;
  }

  return playbackIds ? (
    <Container className="mb-2">
      <Row>
        <Col xs={11}>
          <StreamViewer
            playbackIds={playbackIds}
            volume={volume}
            muted={muted}
          />
        </Col>
        <Col xs={1}>
          <ButtonGroup vertical>{muteToggler}</ButtonGroup>
        </Col>
      </Row>
    </Container>
  ) : (
    <></>
  );
};
export default ViewerControlPanel;
