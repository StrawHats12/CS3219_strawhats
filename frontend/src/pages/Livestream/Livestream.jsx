import {useParams} from "react-router";
import {StreamerControlPanel, ViewerControlPanel} from "../../components/Livestream";
import useAuth from "../../hooks/useAuth";

const Livestream = () => {
  const pageTitle = "Livestream";
  const {streamerId} = useParams();
  const {currentUser} = useAuth();

  return currentUser?.username === streamerId ? (
      <>
        <title>{pageTitle}</title>
        <h1> Hi there Streamer @{streamerId}</h1>
        <StreamerControlPanel streamerId={streamerId}/>
      </>
  ) : (
      <>
        <title>{pageTitle}</title>
        <h1> You're watching {streamerId}</h1>
        <ViewerControlPanel streamerId={streamerId}/>
      </>
  );
};

export default Livestream;
