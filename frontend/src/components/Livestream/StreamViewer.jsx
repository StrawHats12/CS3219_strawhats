import ReactPlayer from "react-player";
import { LIVESTREAM } from "../../const";
import Chatbox from "./Chatbox/Chatbox";

import "./StreamViewer.css";

const StreamViewer = (props) => {
  const isTestingFlag = true; // just for testing, can't have livestream all the time
  const {playbackIds} = props;
  const playbackId = playbackIds.length > 0
      ? playbackIds[0].id
      : null
  const playbackUrl = isTestingFlag
    ? "https://www.youtube.com/watch?v=qmN1Gf8rRc8"
    : LIVESTREAM.PLAYBACK_BASE_URL + playbackId + ".m3u8";
  const videoPlayer = (
    <div className="stream-viewer-wrapper">
      <ReactPlayer
        url={playbackUrl}
        playing={true}
        width="100%"
        height="100%"
        className="react-player"
      />
      <div className="stream-viewer-overlay">
        <Chatbox livestreamId="livestreamId" />
      </div>
    </div>
  );
  return playbackId ? (
    <>
      <p>displaying stream of id: {playbackId}</p>
      {videoPlayer}
    </>
  ) : (
    <p> no playbacks available atm </p>
  );
};

export default StreamViewer;
