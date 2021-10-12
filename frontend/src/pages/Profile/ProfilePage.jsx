import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router";
import { ProfileCard, ProfileReviews } from "../../components/Profile";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { getAccount } from "../../services/account-service";

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

  useEffect(() => {
    setIsLoading(true);
    getAccount(username)
      .then((account) => {
        setProfile(account);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [username, isEditing]);

  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user.username === username) {
        setCanEdit(true);
      }
    });
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
        <p>{error.toString()}</p>
      ) : (
        <>
          {isEditing ? (
            <ProfileCard
              edit
              setIsEditing={setIsEditing}
              setIsLoading={setIsLoading}
              profile={profile}
            />
          ) : (
            <ProfileCard view profile={profile} />
          )}
          {!!profile?.reviews?.length && !isEditing && (
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
