import { Container, Spinner } from "react-bootstrap";

const StrawhatSpinner = () => {
  return (
    <Container className="mx-auto text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </Container>
  );
};

export default StrawhatSpinner;
