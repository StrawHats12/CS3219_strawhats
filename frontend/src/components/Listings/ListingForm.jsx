import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import ListingsImagesUpload from "./ListingsImagesUpload";

const LISTING_NAME = "listing_name";
const DESCRIPTION = "description";
const DEADLINE = "deadline";

const ListingForm = (props) => {
  const item = props;

  const [form, setForm] = useState({
    LISTING_NAME: item[LISTING_NAME] || "",
    DESCRIPTION: item[DESCRIPTION] || "",
    DEADLINE: item[DEADLINE] || "",
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

    if (!form[LISTING_NAME]) {
      newErrors[LISTING_NAME] = "cannot be blank!";
    }

    if (!form[DESCRIPTION]) {
      newErrors[DESCRIPTION] = "cannot be blank!";
    }

    if (!form[DEADLINE]) {
      newErrors[DEADLINE] = "cannot be blank!";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // TODO, Submission Logic
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
            defaultValue={form[LISTING_NAME]}
            onChange={(e) => setField(LISTING_NAME, e.target.value)}
            isInvalid={!!errors[LISTING_NAME]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[LISTING_NAME]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formListingDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Enter listing description"
            style={{ height: "200px" }}
            defaultValue={form[DESCRIPTION]}
            onChange={(e) => setField(DESCRIPTION, e.target.value)}
            isInvalid={!!errors[DESCRIPTION]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[DESCRIPTION]}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formListingName">
          <Form.Label>Bidding Deadline</Form.Label>
          <Form.Control
            type="datetime-local"
            placeholder="Enter listingName"
            defaultValue={form[DEADLINE]}
            onChange={(e) => setField(DEADLINE, e.target.value)}
            isInvalid={!!errors[DEADLINE]}
          />
          <Form.Control.Feedback type="invalid">
            {errors[DEADLINE]}
          </Form.Control.Feedback>
          <Form.Text>
            The bidding will close after the bidding deadline.
          </Form.Text>
        </Form.Group>
      </Form>
      <Form.Label>Images</Form.Label>
      <ListingsImagesUpload imageFiles={imageFiles} setImageFiles={setImageFiles} />
      <Button variant="success" onClick={handleSubmit}>
        Create Listing
      </Button>
    </Container>
  );
};

export default ListingForm;
