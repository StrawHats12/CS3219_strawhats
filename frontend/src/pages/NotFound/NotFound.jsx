import { Container, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const NotFound = () => {
  return (
    <Container fluid="md" className="mt-5">
      <Row>
        <Col>
          <div className="card">
            <div className="card-header">404</div>
            <div className="card-body">
              <h5 className="card-title">Page Not Found</h5>
              <p className="card-text">
                Looks like you've followed a broken link or entered a URL that
                doesn't exist on this site.
              </p>
              <LinkContainer to="/">
                <button className="btn btn-primary">Home Page</button>
              </LinkContainer>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
