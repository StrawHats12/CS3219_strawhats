import { Card, Container } from "react-bootstrap";
import { formatDate } from "../../utils/DateTime";

const ProfileReviews = (props) => {
  const reviews = props.reviews;
  const avgRating = Math.round(
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  );

  return (
    <Container className="mt-2 mb-2 p-0">
      <h3>Avg Rating: {avgRating}</h3>
      {reviews.map((review, idx) => (
        <Card id={idx} className="mt-2">
          <Card.Body>{review.text}</Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-between">
              <p>Rating: {review.rating} </p>
              <p>{review.username}</p>
              <p>{formatDate(review.createdAt)}</p>
            </div>
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
};

export default ProfileReviews;
