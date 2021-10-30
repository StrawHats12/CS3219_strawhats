import {
  destroyStream,
  fetchPrivateStreamDetails,
  generateStream,
} from "../../services/livestream-service";
import { Button, Card, Container, Form, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";
import { MESSAGES } from "../../const";

// todo: change to stream controls element which can create, delete streams
const StreamControlPanel = (props) => {
  const { streamerId } = props;
  const [livestreamId, setLivestreamId] = useState(undefined);
  const [playbackIds, setPlaybackIds] = useState([]);
  const [streamKey, setStreamKey] = useState(undefined);
  const [displayStream, setDisplayStream] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleStreamCreation = async (e) => {
    e.preventDefault();
    generateStream(streamerId).then((streamData) => {
      console.log(
        "Registered for a stream, here's the stream data",
        streamData
      );
      setPlaybackIds(streamData.playback_ids); // to deprecate
      setStreamKey(streamData.stream_key);
      setLivestreamId(streamData.live_stream_id);
    });
  };

  const toggleDisplayStream = async (e) => {
    e.preventDefault();
    setDisplayStream(!displayStream);
  };

  const handleStreamDestroy = async (e) => {
    e.preventDefault();
    destroyStream(streamerId).then(() => {
      console.log("deleted livestream for streamer id:", streamerId);
    });
    setLivestreamId(undefined);
    setPlaybackIds([]);
    setStreamKey(undefined);
  };

  // attempt to fetch private stream details from the backend:
  useEffect(() => {
    fetchPrivateStreamDetails(streamerId).then((response) => {
      if (response) {
        const { live_stream_id, playback_ids, stream_key } = response;
        setLivestreamId(live_stream_id);
        setPlaybackIds(playback_ids);
        console.log("synced w backend, playback ids: ", playback_ids);
        setStreamKey(stream_key);
      }
    });
  }, [streamerId]);

  const streamKeyDisplay = streamKey && (
    <Card> Your Stream Key: {streamKey}</Card>
  );

  const playbackIdDisplay =
    playbackIds && playbackIds.length > 0 ? (
      playbackIds.map((pid, idx) => {
        return (
          <div key={idx}>
            <Card> Playback id: {pid.id}</Card>
            <Button variant="primary" onClick={handleShow}>
              Streaming Instructions
            </Button>
            <Button onClick={handleStreamDestroy}>Destroy Stream</Button>
            <Button onClick={toggleDisplayStream}>
              {displayStream ? <div>Hide Stream</div> : <div>Show Stream</div>}
            </Button>

            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Streaming Instructions</Modal.Title>
              </Modal.Header>
              <Modal.Body>{MESSAGES.STREAMING_INSTRUCTIONS}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </div>
        );
      })
    ) : (
      <p>No playback ids to show</p>
    );

  const generatorForm = (
    <Form>
      <Button size={"sm"} variant={"primary"} onClick={handleStreamCreation}>
        Generate stream key
      </Button>
    </Form>
  );

  return (
    <>
      <Container>
        {livestreamId ? playbackIdDisplay : generatorForm}
        {streamKeyDisplay}
        {livestreamId && displayStream && (
          <StreamViewer playbackIds={playbackIds} />
        )}
      </Container>
    </>
  );
};
export default StreamControlPanel;
