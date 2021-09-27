
const ImageUpload = (props) => {
  const listing = props.listing;
  const { id, listing_name, description } = listing || {};

  return (
    <Link to={"/listings/" + id} className="text-decoration-none text-reset">
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
    </Link>
  );
};

export default ImageUpload;
