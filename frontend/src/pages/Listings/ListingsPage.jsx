import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getAllListings } from "../../services/listings-service";
import { ListingsCard } from "../../components/Listings";

const ListingsPage = () => {
  const pageTitle = "Listings";
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllListings().then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }

      setListings(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <Container>
      <h1>{pageTitle} Page</h1>
      <Container>
        {isLoading ? (
          <StrawhatSpinner />
        ) : (
          listings?.map((listing, i) => (
            <ListingsCard listing={listing} key={i} />
          ))
        )}
      </Container>
    </Container>
  );
};

export default ListingsPage;
