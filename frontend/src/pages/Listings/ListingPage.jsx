import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import {
  ListingProfileCard,
  ListingsCarousel,
} from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import {
  deleteListing,
  deleteListingImages,
  getListing,
} from "../../services/listings-service";
import { getAccount } from "../../services/account-service";
import { formatDate, stringToDate } from "../../utils/DateTime";
import Countdown from "react-countdown";
import Livestream from "../Livestream";
import BidInfo from "../../components/Bids/BidInfo";

const ListingsPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  // const [isStreamActive, setIsStreamActive] = useState(false); // Unused

  const {
    listing_name,
    description,
    images,
    seller_uid,
    seller_username,
    deadline,
  } = listing;

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
  const handleCloseStreamModal = () => setShowStreamModal(false);
  const handleShowStreamModal = () => setShowStreamModal(true);
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteListingImages(images, seller_uid);
      await deleteListing(id);
      history.push("/listings");
    } catch (error) {
      setIsLoading(false);
      handleCloseDeleteModal();
      alert("Error deleting resource");
    }
  };

  const handleEdit = () => {
    history.push(`/listings/edit/${id}`);
  };

  const redirectToChat = async () => {
    if (profile) {
      history.push(`/messenger/?user=${profile.username}`);
    } else {
      alert("User profile not found.");
    }
  };

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p>Bidding has ended! ({formatDate(deadline)})</p>;
    } else {
      return (
        <span>
          Bidding ends in{" "}
          <b>
            {hours}:{minutes}:{seconds}
          </b>{" "}
          ({formatDate(deadline)})
        </span>
      );
    }
  };

  const hasNotExpired = (deadline) => {
    return Date.parse(deadline) > Date.now();
  };

  useEffect(() => {
    async function checkOwner(id) {
      const user = await getCurrentUser();
      if (user?.attributes?.sub === id) {
        setIsOwner(true);
      }
    }

    getListing(id).then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }

      checkOwner(res.seller_sub);
      setListing(res);
      getAccount(seller_username)
        .then((account) => {
          setProfile(account);
        })
        .catch(() => {
          console.error("Unable to find profile");
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, [id, seller_username]);

  const streamEntry = seller_username && (
    <OverlayTrigger
      placement="left"
      delay={{ show: 250, hide: 300 }}
      overlay={<Tooltip>Watch {seller_username}'s Stream.</Tooltip>}
    >
      <Button onClick={handleShowStreamModal}>Watch Stream</Button>
    </OverlayTrigger>
  );

  const chatButton = !isOwner && (
    <OverlayTrigger
      placement="left"
      delay={{ show: 250, hide: 300 }}
      overlay={<Tooltip>Chat with {seller_username}.</Tooltip>}
    >
      <Button className="m-1" onClick={redirectToChat}>
        Chat with seller!
      </Button>
    </OverlayTrigger>
  );

  const streamViewModal = seller_username && (
    <Modal show={showStreamModal} onHide={handleCloseStreamModal}>
      <Modal.Header closeButton>
        <Modal.Title>{seller_username}'s Stream</Modal.Title>
      </Modal.Header>
      <Livestream streamerId={seller_username} />

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseStreamModal}>
          Back
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const deleteListingModal = (
    <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Listing</Modal.Title>
      </Modal.Header>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <Modal.Body>
          Are you sure you want to delete <strong>{listing_name}</strong>?
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeleteModal}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const deadlineDisplay = (
    <div>
      <div className="deadlineCard">
        <div className="deadline-card-header">Deadline</div>
        <div className="deadline-card-main">
          <p>
            {deadline && (
              <Countdown
                date={stringToDate(deadline)}
                renderer={countdownRenderer}
              />
            )}
          </p>
        </div>
      </div>
    </div>
  );

  const listingsCarousel = (
    <div className="flex-fill" style={{ paddingRight: "0.5em" }}>
      <ListingsCarousel seller_uid={seller_uid} imageUris={images} />
      <div className="my-2">
        <h3 className="py-1">Description</h3>
        <div
          className="p-2 m-0"
          style={{ whiteSpace: "pre-wrap", maxWidth: "50vw" }}
        >
          {description}
        </div>
      </div>
      {chatButton}
    </div>
  );

  return (
    <>
      {streamViewModal}
      {deleteListingModal}
      {isLoading ? (
        <StrawhatSpinner />
      ) : listing ? (
        <Container fluid>
          <div className="d-flex justify-content-between align-items-center">
            <h1>{listing_name}</h1>
            <div>
              {isOwner &&
                (hasNotExpired(deadline) ? (
                  <>
                    <Button className="m-1" onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button className="m-1" onClick={handleShowDeleteModal}>
                      Delete
                    </Button>
                  </>
                ) : (
                  <>
                    <OverlayTrigger
                      placement="left"
                      delay={{ show: 250, hide: 300 }}
                      overlay={
                        <Tooltip>
                          Listing cannot be edited after the deadline. Contact
                          support for assistance.
                        </Tooltip>
                      }
                    >
                      <Button className="m-1" variant="secondary">
                        Edit
                      </Button>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="left"
                      delay={{ show: 250, hide: 300 }}
                      overlay={
                        <Tooltip>
                          Listing cannot be deleted after the deadline. Contact
                          support for assistance.
                        </Tooltip>
                      }
                    >
                      <Button className="m-1" variant="secondary">
                        Delete
                      </Button>
                    </OverlayTrigger>
                  </>
                ))}
            </div>
          </div>
          <div className="d-flex">
            {listingsCarousel}
            <div className="flex-fill" style={{ paddingLeft: "0.5em" }}>
              {/*<Livestream streamerId={profile.username}/>*/}
              <Livestream streamerId={"kormingsoon"} />{" "}
              {/*todo: unset when deploying*/}
              <br />
              <div>
                <ListingProfileCard profile={profile} />
              </div>
              <br />
              {deadlineDisplay}
              <br />
              <BidInfo
                isOwner={isOwner}
                deadline={deadline}
                listingInfo={listing}
              />
            </div>
          </div>
        </Container>
      ) : (
        <Container>
          There was an issue viewing this listing. Please make sure the url is
          correct.
        </Container>
      )}
    </>
  );
};

export default ListingsPage;
