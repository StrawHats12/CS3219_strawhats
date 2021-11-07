import { Container } from "react-bootstrap";
import { ListingForm } from "../../components/Listings";

const CreateListingPage = () => {
  const pageTitle = "Create Listing";

  return (
    <Container>
      <h1>{pageTitle} Page</h1>
      <ListingForm create/>
    </Container>
  );
};

export default CreateListingPage;
