import {
  destroyStream,
  fetchPrivateStreamDetails,
  generateStream,
} from "../../services/livestream-service";
import { Accordion, Button, Card, Container, Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";
import StrawhatSpinner from "../StrawhatSpinner";

const StreamerControlPanel = (props) => {
  const { streamerId } = props;
  const [livestreamId, setLivestreamId] = useState(undefined);
  const [playbackIds, setPlaybackIds] = useState([]);
  const [streamKey, setStreamKey] = useState(undefined);
  const [displayStream, setDisplayStream] = useState(false);
  const [displayStreamKeyModal, setDisplayStreamKeyModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [volume, setVolume] = useState(0.6);
  const volume = 0.6;
  const [muted, setMuted] = useState(false);

  const handleStreamCreation = (e) => {
    e.preventDefault();
    setIsLoading(true);
    generateStream(streamerId)
      .then((streamData) => {
        setPlaybackIds(streamData.playback_ids); // to deprecate
        setStreamKey(streamData.stream_key);
        setLivestreamId(streamData.live_stream_id);
      })
      .catch((err) => {
        alert(err.toString());
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStreamDestroy = (e) => {
    e.preventDefault();
    destroyStream(streamerId);
    setLivestreamId(undefined);
    setPlaybackIds([]);
    setStreamKey(undefined);
  };

  const toggleDisplayStream = (e) => {
    e.preventDefault();
    setDisplayStream(!displayStream);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  // attempt to fetch private stream details from the backend:
  useEffect(() => {
    fetchPrivateStreamDetails(streamerId).then((response) => {
      if (response) {
        const { live_stream_id, playback_ids, stream_key } = response;
        setLivestreamId(live_stream_id);
        setPlaybackIds(playback_ids);
        setStreamKey(stream_key);
      }
    });
  }, [streamerId]);

  // const streamKeyDisplay = streamKey && (
  //   <Card> Your Stream Key: {streamKey}</Card>
  // );
  const showStreamKeyModal = () => {
    setDisplayStreamKeyModal(true);
  };

  const hideStreamKeyModal = () => {
    setDisplayStreamKeyModal(false);
  };

  const streamKeyModal = (
    <Modal show={displayStreamKeyModal} onHide={hideStreamKeyModal}>
      <Modal.Header closeButton>
        <Modal.Title>Stream Key</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your Stream Key:
        <Card>{streamKey}</Card>
      </Modal.Body>
    </Modal>
  );

  return isLoading ? (
    <StrawhatSpinner />
  ) : (
    <>
      {streamKeyModal}
      <Container>
        {livestreamId ? (
          <>
            <div className="my-2">
              <Button variant="primary" onClick={handleStreamDestroy}>
                End Stream
              </Button>
              {displayStream ? (
                <>
                  <Button
                    className="mx-2"
                    variant="primary"
                    onClick={toggleDisplayStream}
                  >
                    Hide Stream
                  </Button>
                  {muted ? (
                    <Button variant="primary" onClick={toggleMute}>
                      Unmute
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={toggleMute}>
                      Mute
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  className="mx-2"
                  variant="primary"
                  onClick={toggleDisplayStream}
                >
                  Show Stream
                </Button>
              )}
            </div>
            {displayStream && (
              <StreamViewer
                playbackIds={playbackIds}
                volume={volume}
                muted={muted}
              />
            )}
            <Accordion className="my-2" defaultActiveKey="0">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Software Requirements</Accordion.Header>
                <Accordion.Body>
                  Streaming requires the use of streaming software. We recommend
                  using OBS Studio for your streaming. OBS Studio is free and
                  open source and can be downloaded here:{" "}
                  <a href="https://obsproject.com">https://obsproject.com</a>.
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Streaming Instructions</Accordion.Header>
                <Accordion.Body>
                  To be able to stream, follow the instructions on streaming
                  here:{" "}
                  <a href="https://obsproject.com/wiki/OBS-Studio-Overview">
                    https://obsproject.com/wiki/OBS-Studio-Overview
                  </a>
                  .
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="2">
                <Accordion.Header>Stream Keys</Accordion.Header>
                <Accordion.Body>
                  Server URL: <Card>rtmp://global-live.mux.com:5222/app</Card>
                  <Button className="my-2" onClick={showStreamKeyModal}>
                    View Stream Keys
                  </Button>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </>
        ) : (
          <Card className="mt-4">
            <Card.Body>
              <Card.Title>Start Streaming</Card.Title>
              <Card.Text>
                Welcome {streamerId}, click the button below when you are ready
                to stream.
              </Card.Text>
              <Button variant="primary" onClick={handleStreamCreation}>
                Start Stream
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};
export default StreamerControlPanel;
