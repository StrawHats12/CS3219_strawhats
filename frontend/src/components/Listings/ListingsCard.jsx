import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import placeholder from "./placeholder-image.jpg";

const ListingsCard = (props) => {
  const listing = props.listing;
  const { id, listing_name, description, images, seller_uid } = listing || {};
  const [image, setImage] = useState(placeholder);

  useEffect(() => {
    async function getImage() {
      if (images && images.length) {
        const image = await Storage.get(images[0], {
          level: "protected",
          identityId: seller_uid,
        });
        setImage(image);
      }
    }
    getImage();
  }, [seller_uid, images]);

  return (
    <Link to={"/listings/" + id} className="text-decoration-none text-reset">
      <Card className="mb-4">
        <Row>
          <Col className="col-3">
            <Card.Img variant="top" src={image} />
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

export default ListingsCard;
