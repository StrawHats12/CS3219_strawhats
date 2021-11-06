import {destroyStream, fetchPrivateStreamDetails, generateStream,} from "../../services/livestream-service";
import {Button, Card, Col, Container, Form, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {StreamViewer} from "./index";
import {MESSAGES} from "../../const";
import {GoMute, GoUnmute} from "react-icons/all";

const StreamerControlPanel = (props) => {
  const {streamerId} = props;
  const [livestreamId, setLivestreamId] = useState(undefined);
  const [playbackIds, setPlaybackIds] = useState([]);
  const [streamKey, setStreamKey] = useState(undefined);
  const [displayStream, setDisplayStream] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleStreamCreation = async (e) => {
    e.preventDefault();
    generateStream(streamerId)
        .then((streamData) => {
          setPlaybackIds(streamData.playback_ids); // to deprecate
          setStreamKey(streamData.stream_key);
          setLivestreamId(streamData.live_stream_id);
        })
        .catch((err) => {
          alert(err.toString());
        });
  };

  const toggleDisplayStream = async (e) => {
    e.preventDefault();
    setDisplayStream(!displayStream);
  };

  const handleStreamDestroy = async (e) => {
    e.preventDefault();
    destroyStream(streamerId);
    setLivestreamId(undefined);
    setPlaybackIds([]);
    setStreamKey(undefined);
  };

  // attempt to fetch private stream details from the backend:
  useEffect(() => {
    fetchPrivateStreamDetails(streamerId).then((response) => {
      if (response) {
        const {live_stream_id, playback_ids, stream_key} = response;
        setLivestreamId(live_stream_id);
        setPlaybackIds(playback_ids);
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
          <p>Stream is not live yet.</p>
      );

  const toggleMute = () => {
    console.log("Togglemute");
    setMuted(!muted);
  }


  const generatorForm = (
      <Form>
        <Button size={"sm"} variant={"primary"} onClick={handleStreamCreation}>
          Generate stream key
        </Button>
      </Form>
  );

  const muteToggler = <>
    {muted
        ? <GoUnmute
            onClick={toggleMute}
        />
        : <GoMute
            onClick={toggleMute}

        />}
  </>


  return (
      <>
        <Container>
          {livestreamId ? playbackIdDisplay : generatorForm}
          {streamKeyDisplay}
          <Row>
            <Col xs={11}>
              {livestreamId && displayStream && (
                  <StreamViewer
                      playbackIds={playbackIds}
                      volume={volume}
                      muted={muted}
                  />
              )}

            </Col>
            <Col xs={1}>
              {muteToggler}
            </Col>

          </Row>
        </Container>
      </>
  );
};
export default StreamerControlPanel;
