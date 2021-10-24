import ReactPlayer from "react-player"
import {LIVESTREAM} from "../../const";

const StreamViewer = (props) => {
  const isTestingFlag = false // just for testing, can't have livestream all the time
  const {playbackIds} = props;
  console.log("playback ids", playbackIds)
  const playbackId = playbackIds[0] // todo: handle this to be any of public playback id
  console.log("... playback id:", playbackId)
  const playbackUrl = isTestingFlag
      ? "https://www.youtube.com/watch?v=qmN1Gf8rRc8"
      : LIVESTREAM.PLAYBACK_BASE_URL + playbackId + ".m3u8"
  const videoPlayer = <ReactPlayer url={playbackUrl} playing={true}/>

  return playbackId
      ? (<>
        <p>displaying stream of id: {playbackId}</p>
        {videoPlayer}
      </>)
      : <p> no playbacks available atm </p>;
}

export default StreamViewer;