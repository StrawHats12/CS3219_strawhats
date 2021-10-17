import ReactStars from "react-rating-stars-component";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import StrawhatSpinner from "../StrawhatSpinner";
import { addReview } from "../../services/account-service";

const ReviewModal = (props) => {
  const showModal = props.showModal;
  const accountUsername = props.accountUsername;
  const handleCloseModal = props.handleCloseModal;

  const defaultReview = {
    text: "",
    rating: 4,
  };

  const [review, setReview] = useState(defaultReview);
  const [isLoading, setIsLoading] = useState(false);

  const setField = (field, value) => {
    setReview({
      ...review,
      [field]: value,
    });
  };

  const ratingChanged = (newRating) => {
    setField("rating", newRating);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    addReview(review, accountUsername)
      .catch((err) => {
        alert(err.toString());
      })
      .finally(() => {
        setIsLoading(false);
        setReview(defaultReview);
        handleCloseModal();
      });
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="formAccountName">
                <Form.Control
                  as="textarea"
                  placeholder="Tell us about your experience with this user?"
                  style={{ resize: "none" }}
                  maxLength={1000}
                  rows={10}
                  defaultValue={review.text}
                  onChange={(e) => setField("text", e.target.value)}
                />
              </Form.Group>
            </Form>
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
              value={review.rating}
            />
          </Modal.Body>
          <Modal.Footer>
            <p>
              Note: Adding a new review will override any previous reviews you
              have made.
            </p>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
};

export default ReviewModal;
