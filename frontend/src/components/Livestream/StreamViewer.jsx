import ReactPlayer from "react-player";
import { LIVESTREAM } from "../../const";
import Chatbox from "./Chatbox/Chatbox";

import "./StreamViewer.css";
import {useState} from "react";

const StreamViewer = (props) => {
  // const isTestingFlag = false; // just for testing, can't have livestream all the time
  const isTestingFlag = true; // just for testing, can't have livestream all the time
  const { playbackIds, volume, muted } = props;
  console.log("playback ids:", playbackIds)
  const playbackId = playbackIds && playbackIds.length && playbackIds[0].id;
  const playbackUrl = isTestingFlag
    ? "https://www.youtube.com/watch?v=dEBwXKx0Hbk&t=4079s"
    : LIVESTREAM.PLAYBACK_BASE_URL + playbackId + ".m3u8";
  const videoPlayer = (
    <div className="stream-viewer-wrapper">
      <ReactPlayer
        url={playbackUrl}
        playing={true}
        width="100%"
        height="100%"
        className="react-player"
        pip={true}
        controls={true}
        stopOnUnmount={false}
        volume={volume}
        muted={muted}
        onBuffer={()=>console.log("...bufferring")}
        onBufferEnd={()=>console.log("...DONE bufferring")}
      />
      <div className="stream-viewer-overlay">
        <Chatbox livestreamId="livestreamId" />
      </div>
    </div>
  );
  return playbackId ? (
    <>
      {videoPlayer}
    </>
  ) : (
    <p> no playbacks available atm </p>
  );
};

export default StreamViewer;
