import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getListing } from "../../services/listings-service";
import ListingsCard from "../../components/Listings/ListingsCard";

const ListingsPage = () => {
  const pageTitle = "Listing";
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <h1>{pageTitle} Page</h1>
      <Container>
        {isLoading ? (
          <StrawhatSpinner />
        ) : (
          <ListingsCard listing={listing} />
        )}
      </Container>
    </>
  );
};

export default ListingsPage;
