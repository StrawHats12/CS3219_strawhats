import {useParams} from "react-router";
import {StreamerControlPanel, ViewerControlPanel} from "../../components/Livestream";
import useAuth from "../../hooks/useAuth";
import {useState} from "react";

const Livestream = (props) => {
  const pageTitle = "Livestream";
  const params = useParams();
  const {size} = props;
  const streamerId = props.streamerId || params.streamerId;
  // const [streamStatus, setStreamStatus] = useState("idle") // todo: lift state up from control panel to livestream component

  const {currentUser} = useAuth();

  return currentUser?.username === streamerId ? (
      <>
        <title>{pageTitle}</title>
        <StreamerControlPanel streamerId={streamerId}/>
      </>
  ) : (
      <>
        <title>{pageTitle}</title>
        <ViewerControlPanel streamerId={streamerId}/>
      </>
  );
};

export default Livestream;
