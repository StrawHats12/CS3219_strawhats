import { Card, Col, Row } from "react-bootstrap";

const ListingsCard = (props) => {
  const { listing_name, description } = props.listing;

  return (
    <Card className="mb-4">
      <Row>
        <Col className="col-3">
          <Card.Img
            variant="top"
            src={process.env.PUBLIC_URL + "/logo192.png"}
          />
        </Col>
        <Col>
          <Card.Body>
            <Card.Title>{listing_name}</Card.Title>
            <Card.Text>{description}</Card.Text>
          </Card.Body>
        </Col>
      </Row>
    </Card>
  );
};

export default ListingsCard;
