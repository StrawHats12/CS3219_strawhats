import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import ListingsImagesUpload from "./ListingsImagesUpload";
import { LISTING } from "../../const";
import { getCurrentUser, getCurrentUserCredentials } from "../../hooks/useAuth";
import {
  createListing,
  deleteListingImages,
  generateListingId,
  updateListing,
} from "../../services/listings-service";
import { useHistory } from "react-router";

const ListingForm = (props) => {
  const history = useHistory();
  let item = props.item;

  if (props.create) {
    item = {
      [LISTING.NAME]: "",
      [LISTING.DESCRIPTION]: "",
      [LISTING.DEADLINE]: new Date().toISOString().substr(0, 16),
    };
  }

  const [form, setForm] = useState({ ...item });
  const [errors, setErrors] = useState({});
  const [imageFiles, setImageFiles] = useState(item[LISTING.IMAGES] || []);
  const [deleteImages, setDeleteImages] = useState([]);

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
      const listing = {
        ...form,
        [LISTING.IMAGES]: [...imageFiles],
      };

      if (props.create) {
        const sellerCredentials = await getCurrentUserCredentials();
        const seller = await getCurrentUser();
        listing[LISTING.ID] = generateListingId();
        listing[LISTING.SELLER_ID] = sellerCredentials?.identityId;
        listing[LISTING.SELLER_SUB] = seller?.attributes?.sub;
        listing[LISTING.SELLER_USERNAME] = seller?.username;
      }

      if (props.create) {
        await createListing(listing);
      } else if (props.edit) {
        await updateListing(listing);
      } else {
        throw new Error("Missing Props in ListingForm.jsx");
      }

      deleteListingImages(deleteImages, listing[LISTING.SELLER_ID]);
      history.push(`/listings/${listing[LISTING.ID]}`);
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
        deleteImages={deleteImages}
        setDeleteImages={setDeleteImages}
      />
      <Button variant="success" onClick={handleSubmit}>
        {props.create && "Create Listing"}
        {props.edit && "Update Listing"}
      </Button>
    </Container>
  );
};

export default ListingForm;
