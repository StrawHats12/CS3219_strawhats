import {useParams} from "react-router";
import {StreamControlPanel} from "../../components/Livestream"

const Livestream = () => {
  const pageTitle = "Livestream";
  const {streamerId} = useParams();

  return <>
    <title>{pageTitle}</title>
    <h1> Hi there Streamer @{streamerId}</h1>
    <StreamControlPanel streamerId={streamerId}/>
  </>;
};

export default Livestream;
