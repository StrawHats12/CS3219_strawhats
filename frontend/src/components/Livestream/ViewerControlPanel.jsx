import { fetchPublicStreamDetails } from "../../services/livestream-service";
import { Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";

// todo: change to stream controls element which can create, delete streams
const ViewerControlPanel = (props) => {
  const { streamerId } = props;
  const [playbackIds, setPlaybackIds] = useState([]);

  useEffect(() => {
    fetchPublicStreamDetails(streamerId)
      .then((response) => {
        if (response) {
          const { playback_ids } = response;
          setPlaybackIds(playback_ids);
        }
      })
      .catch((e) => {
        console.error(e.toString());
      });
  }, [streamerId]);

  return (
    <Container>
      <StreamViewer playbackIds={playbackIds} />
    </Container>
  );
};
export default ViewerControlPanel;
