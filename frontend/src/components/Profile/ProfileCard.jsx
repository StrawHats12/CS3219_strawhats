import { Col, Container, Figure, Row } from "react-bootstrap";
import PlaceholderProfileImage from "./placeholderProfileImage.jpg";

const ProfileCard = (props) => {
  const profile = props.profile;
  const image = profile.image || PlaceholderProfileImage;

  return (
    <Container>
      <Row>
        <Col sm={3}>
          <Figure>
            <Figure.Image width={180} height={180} alt="profile" src={image} />
          </Figure>
        </Col>
        <Col>
          <h2>{profile.name || profile.username}</h2>
          <p>{profile.about || "This user does not have an about section yet."}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileCard;
