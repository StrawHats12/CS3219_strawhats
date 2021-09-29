import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import ListingsImagesUpload from "./ListingsImagesUpload";
import { LISTING } from "../../const";
import { getCurrentUser } from "../../hooks/useAuth";
import { createListing } from "../../services/listings-service";

const ListingForm = (props) => {
  const item = props;

  const [form, setForm] = useState({
    [LISTING.NAME]: item[LISTING.NAME] || "",
    [LISTING.DESCRIPTION]: item[LISTING.DESCRIPTION] || "",
    [LISTING.DEADLINE]: item[LISTING.DEADLINE] || "",
  });
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]); // Image Files

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });

    if (!!errors[field])
      setErrors({
        ...errors,
        [field]: null,
      });
  };

  const findFormErrors = () => {
    const newErrors = {};

    if (!form[LISTING.NAME]) {
      newErrors[LISTING.NAME] = "cannot be blank!";
    }

    if (!form[LISTING.DESCRIPTION]) {
      newErrors[LISTING.DESCRIPTION] = "cannot be blank!";
    }

    if (!form[LISTING.DEADLINE]) {
      newErrors[LISTING.DEADLINE] = "cannot be blank!";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // const seller_id = await getCurrentUser().attributes.sub;
      const seller_id = await getCurrentUser();
      const listing = {
        ...form,
        [LISTING.SELLER_ID]: seller_id.attributes.sub,
        [LISTING.IMAGES]: [...imageFiles],
      };

      createListing(listing);
      alert("Listing Created!");
    }
  };

  return (
    <Container>
      <Form>
        <Form.Group className="mb-3" controlId="formListingName">
          <Form.Label>Listing Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter listing name"
            defaultValue={form[LISTING.NAME]}
            onChange={(e) => setField(LISTING.NAME, e.target.value)}
            isInvalid={!!errors[LISTING.NAME]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[LISTING.NAME]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formListingDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter listing description"
            style={{ height: "200px" }}
            defaultValue={form[LISTING.DESCRIPTION]}
            onChange={(e) => setField(LISTING.DESCRIPTION, e.target.value)}
            isInvalid={!!errors[LISTING.DESCRIPTION]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[LISTING.DESCRIPTION]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formListingName">
          <Form.Label>Bidding Deadline</Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="Enter listingName"
            defaultValue={form[LISTING.DEADLINE]}
            onChange={(e) => setField(LISTING.DEADLINE, e.target.value)}
            isInvalid={!!errors[LISTING.DEADLINE]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[LISTING.DEADLINE]}
          </Form.Control.Feedback>
          <Form.Text>
            The bidding will close after the bidding deadline.
          </Form.Text>
        </Form.Group>
      </Form>
      <Form.Label>Images</Form.Label>
      <ListingsImagesUpload
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
      />
      <Button variant="success" onClick={handleSubmit}>
        Create Listing
      </Button>
    </Container>
  );
};

export default ListingForm;
