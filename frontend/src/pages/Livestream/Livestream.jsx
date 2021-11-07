import { Container } from "react-bootstrap";
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
    <Container>
      <h1>
        {streamerId}'s {pageTitle}
      </h1>
      <StreamerControlPanel streamerId={streamerId} />
    </Container>
  ) : (
    <Container>
      <h1>
        {streamerId}'s {pageTitle}
      </h1>
      <ViewerControlPanel streamerId={streamerId} />
    </Container>
  );
};

export default Livestream;
