import { Card, Container } from "react-bootstrap";

const ProfileReviews = (props) => {
  const reviews = props.reviews;
  const avgRating = Math.round(
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  );

  return (
    <Container className="m-2">
      <h3>Avg Rating: {avgRating}</h3>
      {reviews.map((review, idx) => (
        <Card id={idx}>
          <Card.Body>{review.text}</Card.Body>
          <Card.Footer>
            Rating: {review.rating} User:{review.username}
          </Card.Footer>
        </Card>
      ))}
    </Container>
  );
};

export default ProfileReviews;
