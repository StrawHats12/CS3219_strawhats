import {destroyStream, fetchPrivateStreamDetails, generateStream,} from "../../services/livestream-service";
import {Container} from "react-bootstrap";
import {useEffect, useState} from "react";
import {StreamViewer} from "./index";

// todo: change to stream controls element which can create, delete streams
const ViewerControlPanel = (props) => {
  const {streamerId} = props;
  const [playbackIds, setPlaybackIds] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);



  // const toggleDisplayStream = async (e) => {
  //   e.preventDefault();
  //   setDisplayStream(!displayStream);
  // };

  // attempt to fetch private stream details from the backend:
  useEffect(() => {
    // todo: lift state up to the livestream page itself
    fetchPrivateStreamDetails(streamerId).then((response) => {
      if (response) {
        const {playback_ids} = response;
        setPlaybackIds(playback_ids);
        console.log("synced w backend, playback ids: ", playback_ids);
      }
    });
  }, [streamerId]);

  return (
      <>
        <Container>
          <StreamViewer playbackIds={playbackIds}/>
        </Container>
      </>
  );
};
export default ViewerControlPanel;
