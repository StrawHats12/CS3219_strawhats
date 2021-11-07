import { useParams } from "react-router";
import {
  StreamerControlPanel,
  ViewerControlPanel,
} from "../../components/Livestream";
import useAuth from "../../hooks/useAuth";

const Livestream = (props) => {
  const pageTitle = "Livestream";
  const params = useParams();
  const streamerId = props.streamerId || params.streamerId;

  const { currentUser } = useAuth();

  if (!streamerId) {
    return (
      <>
        <p>Invalid streamer id</p>
      </>
    );
  }

  return currentUser?.username === streamerId ? (
    <>
      <h1>{pageTitle}</h1>
      <StreamerControlPanel streamerId={streamerId} />
    </>
  ) : (
    <>
      <h1>{pageTitle}</h1>
      <ViewerControlPanel streamerId={streamerId} />
    </>
  );
};

export default Livestream;
