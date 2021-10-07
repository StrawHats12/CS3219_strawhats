import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useParams } from "react-router";
import { ListingsCarousel } from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getListing } from "../../services/listings-service";

const ListingsPage = () => {
  const { id } = useParams();

  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { listing_name, description, images, seller_uid } = listing;

  useEffect(() => {
    getListing(id).then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }

      setListing(res);
      setIsLoading(false);
    });
  }, [id]);

  return (
    <>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <Container>
          <h1>{listing_name}</h1>
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
      )}
    </>
  );
};

export default ListingsPage;
