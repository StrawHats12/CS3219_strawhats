import Storage from "@aws-amplify/storage";
import { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useHistory } from "react-router";
import PlaceholderProfileImage from "./placeholderProfileImage.jpg";

const ListingProfileCard = (props) => {
  const profile = props.profile;
  const [image, setImage] = useState(PlaceholderProfileImage);
  const history = useHistory();
  const goToProfile = () => {
    if (profile) {
      history.push(`/profile/${profile.username}`);
    }
  };

  useEffect(() => {
    if (profile && profile.image && profile.uid) {
      Storage.get(profile.image, {
        level: "protected",
        identityId: profile.uid,
      }).then((image) => {
        setImage(image);
      });
    }
  }, [profile]);

  return (
    <Container
      className="d-flex align-items-center border px-3 py-2"
      onClick={goToProfile}
      style={profile && { cursor: "pointer" }}
    >
      <Image
        width={50}
        height={50}
        alt="profile"
        src={image}
        roundedCircle
        className="m-0"
      />
      {profile ? (
        <h5 className="mx-2 my-0">
          Seller: {profile.name || profile.username}
        </h5>
      ) : (
        <h5 className="mx-2 my-0">Profile Deleted</h5>
      )}
    </Container>
  );
};

export default ListingProfileCard;
