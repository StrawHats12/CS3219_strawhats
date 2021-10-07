import { ListingForm } from "../../components/Listings";

const CreateListingPage = () => {
  const pageTitle = "Create Listing";

  return (
    <>
      <h1>{pageTitle} Page</h1>
      <ListingForm create/>
    </>
  );
};

export default CreateListingPage;
