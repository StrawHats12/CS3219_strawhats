import ReactStars from "react-rating-stars-component";
import { Card, Container } from "react-bootstrap";
import { formatDate } from "../../utils/DateTime";

const ProfileReviews = (props) => {
  const reviews = props.reviews;
  const avgRating = Math.round(
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  );

  return (
    <Container className="my-2 p-0">
      <div className="d-flex align-items-top">
        <h3>Average Rating: </h3>
        &nbsp;
        <ReactStars count={5} value={avgRating} size={24} edit={false} />
      </div>
      {reviews.map((review, idx) => (
        <Card key={idx} className="mt-2">
          <Card.Body>{review.text}</Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-between">
              <ReactStars count={5} value={review.rating} edit={false} />
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
