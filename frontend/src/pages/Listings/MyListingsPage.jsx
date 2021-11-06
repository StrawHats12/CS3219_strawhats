import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getOwnListings } from "../../services/listings-service";
import { ListingsCard } from "../../components/Listings";
import Livestream from "../Livestream";

const MyListingsPage = () => {
  const pageTitle = "My Listings";
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOwnListings().then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }
      setListings(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <h1>{pageTitle} Page</h1>
      <Container className="mx-0 px-0">
        {isLoading ? (
          <StrawhatSpinner />
        ) : listings.length ? (
          listings?.map((listing, i) => (
            <ListingsCard listing={listing} key={i} />
          ))
        ) : (
          <div>No listings to display</div>
        )}
      </Container>
    </>
  );
};

export default MyListingsPage;
