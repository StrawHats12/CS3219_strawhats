import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import placeholder from "./placeholder-image.jpg";

const ListingsCardVertical = (props) => {
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
      <Card className="m-4" style={{width: "300px"}}>
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Title>{listing_name}</Card.Title>
          <Card.Text>{description}</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ListingsCardVertical;
