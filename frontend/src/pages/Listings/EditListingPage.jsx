import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router";
import { ListingForm } from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { getListing } from "../../services/listings-service";

const EditListingPage = () => {
  const pageTitle = "Edit Listing";
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [listing, setListing] = useState({});

  useEffect(() => {
    async function getListingAsync() {
      setError("");

      const listingToEdit = await getListing(id);

      if (listingToEdit) {
        const user = await getCurrentUser();
        if (user?.attributes?.sub === listingToEdit.seller_sub) {
          setListing(listingToEdit);
        } else {
          setError(
            "Your account does not have sufficient permissions to edit this listing."
          );
        }
      } else {
        setError("Unable to retrieve listing.");
      }

      setIsLoading(false);
    }

    getListingAsync();
  }, [id]);

  return (
    <Container>
      <h1>{pageTitle} Page</h1>
      {isLoading ? (
        <StrawhatSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ListingForm edit item={listing} />
      )}
    </Container>
  );
};

export default EditListingPage;
