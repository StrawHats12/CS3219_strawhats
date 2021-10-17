import { useEffect, useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useParams } from "react-router";
import {
  ProfileCard,
  ProfileReviews,
  ReviewModal,
} from "../../components/Profile";
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
  const [showReviewModal, setShowReviewModal] = useState(false);

  const handleEditClicked = () => {
    if (canEdit) {
      setIsEditing(true);
    }
  };

  const handleAddReviewClicked = () => {
    handleOpenReviewModal();
  };

  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
  };

  useEffect(() => {
    if (!showReviewModal) {
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
    }
  }, [username, isEditing, showReviewModal]);

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
          {!isEditing && (
            <Container>
              <div className="d-flex justify-content-between m-0">
                <h2>Reviews</h2>
                <Button className="m-2" onClick={handleAddReviewClicked}>
                  Add Review
                </Button>
              </div>
              {!!profile?.reviews?.length ? (
                <>
                  <ProfileReviews reviews={profile.reviews} />
                </>
              ) : (
                <p>{username} does not have any reviews yet.</p>
              )}
            </Container>
          )}
        </>
      )}
      <ReviewModal
        showModal={showReviewModal}
        handleCloseModal={handleCloseReviewModal}
        accountUsername={username}
      />
    </>
  );
};

export default ProfilePage;
