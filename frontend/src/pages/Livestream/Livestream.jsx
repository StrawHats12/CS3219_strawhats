import { useParams } from "react-router";
import { StreamControlPanel } from "../../components/Livestream";
import useAuth from "../../hooks/useAuth";

const Livestream = () => {
  const pageTitle = "Livestream";
  const { streamerId } = useParams();
  const { currentUser } = useAuth();

  return currentUser?.username === streamerId ? (
    <>
      <title>{pageTitle}</title>
      <h1> Hi there Streamer @{streamerId}</h1>
      <StreamControlPanel streamerId={streamerId} />
    </>
  ) : (
    <StreamControlPanel streamerId={streamerId} />
  );
};

export default Livestream;
