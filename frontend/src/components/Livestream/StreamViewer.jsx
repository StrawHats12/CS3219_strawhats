import ReactPlayer from "react-player"
import {LIVESTREAM} from "../../const";

const StreamViewer = (props) => {
  const isTestingFlag = true // just for testing, can't have livestream all the time
  const {playbackId} = props;
  const playbackUrl = isTestingFlag
      ? "https://www.youtube.com/watch?v=qmN1Gf8rRc8"
      : LIVESTREAM.PLAYBACK_BASE_URL + playbackId + ".m3u8"
  const videoPlayer = <ReactPlayer url={playbackUrl} playing={true}/>

  return (<>
    <p>diplaying stream of id: {playbackId}</p>
    {videoPlayer}
  </>);
}

export default StreamViewer;