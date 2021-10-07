import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { ListingsCarousel } from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { getListing } from "../../services/listings-service";

const ListingsPage = () => {
  const { id } = useParams();

  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const { listing_name, description, images, seller_uid } = listing;

  const handleEdit = () => {
    console.log("Edit Pressed");
  };

  const handleDelete = () => {
    console.log("Delete Pressed");
  };

  useEffect(() => {
    async function checkOwner(id) {
      const user = await getCurrentUser();
      if (user?.attributes?.sub === id) {
        setIsOwner(true);
      }
    }

    getListing(id).then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }

      checkOwner(res.seller_sub);
      setListing(res);
      setIsLoading(false);
    });
  }, [id]);

  return (
    <>
      {isLoading ? (
        <StrawhatSpinner />
      ) : listing ? (
        <Container>
          <h1>{listing_name}</h1>
          {isOwner && (
            <>
              <Button className="m-1" onClick={handleEdit}>Edit</Button>
              <Button className="m-1" onClick={handleDelete}>Delete</Button>
            </>
          )}
          <Row>
            <Col>
              <ListingsCarousel seller_uid={seller_uid} imageUris={images} />
            </Col>
            <Col>
              <p>Current Bid: $100</p>
            </Col>
          </Row>
          <Row>
            <p>{description}</p>
          </Row>
        </Container>
      ) : (
        <Container>
          There was an issue viewing this listing. Please make sure the url is
          correct.
        </Container>
      )}
    </>
  );
};

export default ListingsPage;
