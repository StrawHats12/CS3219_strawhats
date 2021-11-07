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
    return <></>;
  }

  return currentUser?.username === streamerId ? (
    <>
      <title>{pageTitle}</title>
      <StreamerControlPanel streamerId={streamerId} />
    </>
  ) : (
    <>
      <title>{pageTitle}</title>
      <ViewerControlPanel streamerId={streamerId} />
    </>
  );
};

export default Livestream;
