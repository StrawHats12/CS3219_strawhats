import {
  destroyStream,
  fetchPrivateStreamDetails,
  generateStream,
} from "../../services/livestream-service";
import { Button, Card, Col, Container, Modal, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { StreamViewer } from "./index";
import { MESSAGES } from "../../const";
import {
  BiHelpCircle,
  BiShowAlt,
  GoMute,
  GoUnmute,
  GrFormViewHide,
  VscSettingsGear,
} from "react-icons/all";

const StreamerControlPanel = (props) => {
  const { streamerId } = props;
  const [livestreamId, setLivestreamId] = useState(undefined);
  const [playbackIds, setPlaybackIds] = useState([]);
  const [streamKey, setStreamKey] = useState(undefined);
  const [displayStream, setDisplayStream] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [muted, setMuted] = useState(false);

  const handleCloseHelp = () => setShowModal(false);
  const handleShowHelp = () => setShowModal(true);

  const handleStreamCreation = async (e) => {
    e.preventDefault();
    generateStream(streamerId)
      .then((streamData) => {
        setPlaybackIds(streamData.playback_ids); // to deprecate
        setStreamKey(streamData.stream_key);
        setLivestreamId(streamData.live_stream_id);
        handleCloseSettings();
      })
      .catch((err) => {
        alert(err.toString());
      });
  };

  const toggleDisplayStream = async (e) => {
    e.preventDefault();
    setDisplayStream(!displayStream);
  };

  const toggleMute = () => {
    console.log("Togglemute");
    setMuted(!muted);
  };

  const toggleShowSettings = () => {
    console.log("Toggle show settings");
    setShowSettings(!showSettings);
  };
  const handleCloseSettings = () => setShowSettings(false);
  const handleOpenSettings = () => setShowSettings(true);

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
        const { live_stream_id, playback_ids, stream_key } = response;
        setLivestreamId(live_stream_id);
        setPlaybackIds(playback_ids);
        setStreamKey(stream_key);
      }
    });
  }, [streamerId]);

  const streamKeyDisplay = streamKey && (
    <Card> Your Stream Key: {streamKey}</Card>
  );

  const muteToggler = (
    <>
      {muted ? (
        <GoUnmute onClick={toggleMute} />
      ) : (
        <GoMute onClick={toggleMute} />
      )}
    </>
  );

  const helpModal = (pid) => {
    return (
      <Modal show={showModal} onHide={handleCloseHelp}>
        <Modal.Header closeButton>
          <Modal.Title>Streaming Instructions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {streamKeyDisplay}
          <Card> Playback id: {pid.id}</Card>
          {MESSAGES.STREAMING_INSTRUCTIONS}
        </Modal.Body>
      </Modal>
    );
  };

  const streamHelp = (pid) => (
    <>
      <BiHelpCircle onClick={handleShowHelp} />
      {helpModal(pid)}
    </>
  );

  const streamViewToggler = displayStream ? (
    <BiShowAlt onClick={toggleDisplayStream} />
  ) : (
    <GrFormViewHide onClick={toggleDisplayStream} />
  );

  const streamConfigContent = livestreamId ? (
    <Button onClick={handleStreamDestroy}>Destroy Stream</Button>
  ) : (
    <Button size={"sm"} variant={"primary"} onClick={handleStreamCreation}>
      Generate stream key
    </Button>
  );

  const streamConfigTool = (
    <>
      <VscSettingsGear onClick={handleOpenSettings} />
      <Modal show={showSettings} onHide={handleCloseSettings}>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>{streamConfigContent}</Modal.Body>
      </Modal>
    </>
  );

  const streamerControls =
    playbackIds && playbackIds.length > 0 ? (
      playbackIds.map((pid, idx) => {
        return (
          <div key={idx}>
            {streamHelp(pid)}
            {streamConfigTool}
            {displayStream && muteToggler}
            {streamViewToggler}
          </div>
        );
      })
    ) : (
      <>{streamConfigTool}</>
    );

  return (
    <>
      <Container>
        {streamerControls}
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
        </Row>
      </Container>
    </>
  );
};
export default StreamerControlPanel;
