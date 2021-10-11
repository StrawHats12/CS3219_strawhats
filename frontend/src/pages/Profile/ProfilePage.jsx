import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router";
import { ProfileCard, ProfileReviews } from "../../components/Profile";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";

const ProfilePage = () => {
  const pageTitle = "Profile";
  const { username } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState({});
  const [canEdit, setCanEdit] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClicked = () => {
    if (canEdit) {
      setIsEditing(true);
    }
  };

  const handleSaveClicked = () => {
    setIsEditing(false);
  };

  useEffect(() => {
    // TODO replace stub
    setProfile({
      uname: "username",
      name: "name",
      about: "about this seller",
      email: "email",
      reviews: [
        {
          text: "Good seller will buy again!",
          username: "bob1234",
          rating: 5,
        },
        {
          text: "Bad seller",
          username: "notBob1234",
          rating: 1,
        },
      ],
    });

    getCurrentUser().then((user) => {
      if (user.username === username) {
        setCanEdit(true);
      }
    });

    setIsLoading(false);
  }, [username]);

  return (
    <>
      <Container className="d-flex justify-content-between">
        <h1>{pageTitle} Page</h1>
        {canEdit && !isEditing && !isLoading && (
          <Button className="m-2" onClick={handleEditClicked}>
            Edit Profile
          </Button>
        )}
      </Container>
      {isLoading ? (
        <StrawhatSpinner />
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          {isEditing ? (
            <>
              <ProfileCard edit profile={profile} />
              <Button
                variant="secondary"
                className="m-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button className="m-2" onClick={handleSaveClicked}>
                Save
              </Button>
            </>
          ) : (
            <ProfileCard view profile={profile} />
          )}
          {profile.reviews && !isEditing && (
            <>
              <h2>Reviews</h2>
              <ProfileReviews reviews={profile.reviews} />
            </>
          )}
        </>
      )}
    </>
  );
};

export default ProfilePage;
