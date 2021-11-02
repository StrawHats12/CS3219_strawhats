import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import {
  ListingProfileCard,
  ListingsCarousel,
} from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import useAuth, { getCurrentUser } from "../../hooks/useAuth";
import BidTable from "../../components/Bids/BidTable";
import HighestBidCard from "../../components/Bids/HighestBidCard";
import {
  deleteListing,
  deleteListingImages,
  getListing,
} from "../../services/listings-service";
import { getAccount } from "../../services/account-service";
import { formatDate, stringToDate } from "../../utils/DateTime";
import Countdown from "react-countdown";
import AddBidForm from "../../components/Bids/AddBidForm";
import Livestream from "../Livestream";

const ListingsPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [profile, setProfile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStreamModal, setShowStreamModal] = useState(false);
  const [isStreamActive, setIsStreamActive] = useState(false);

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
          Bidding ends in {hours}:{minutes}:{seconds} ({formatDate(deadline)})
        </span>
      );
    }
  };

  const hasExpired = (deadline) => {
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


  let streamEntry = seller_username && <>
    <Button onClick={handleShowStreamModal}>Click to Watch {seller_username}'s Stream
    </Button>
  </>

  let streamViewModal = seller_username && <>
    <Modal show={showStreamModal} onHide={handleCloseStreamModal}>
      <Modal.Header closeButton>
        <Modal.Title>{seller_username}'s Stream</Modal.Title>
      </Modal.Header>
      <Livestream streamerId={seller_username}/>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseStreamModal}>
          Back
        </Button>
      </Modal.Footer>
    </Modal>
  </>


  return (
    <>
      {streamViewModal}
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
      {isLoading ? (
        <StrawhatSpinner />
      ) : listing ? (
        <Container fluid>
          <h1>{listing_name}</h1>
          {isOwner &&
            (hasExpired(deadline) ? (
              <>
                <Button className="m-1" onClick={handleEdit}>
                  Edit
                </Button>
                <Button className="m-1" onClick={handleShowDeleteModal}>
                  Delete
                </Button>
              </>
            ) : (
              <p> Listing cannot be edited after expiry. </p>
            ))}
          {!isOwner && (
            <Button className="m-1" onClick={redirectToChat}>
              Chat with seller!
            </Button>
          )}
          <Row>
            <Col>
              <ListingsCarousel seller_uid={seller_uid} imageUris={images} />
            </Col>
            <Col>
              <>
                <div className="descriptionCard">
                  <div className="description-card-header">Description</div>
                  <div className="description-card-main">
                    <p> {description} </p>
                  </div>
                </div>
              </>
            </Col>
            <Col>
              <div>
                <ListingProfileCard profile={profile} />
              </div>
              <br />
              <div>
                <>
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
                </>
              </div>
              <br />
              <div>
                <HighestBidCard listingInfo={listing} />
              </div>
              { streamEntry}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              {isOwner ? (
                <div>
                  <h3> Unable to Bid </h3>
                  <p> You cannot bid for your own items.</p>
                </div>
              ) : hasExpired(deadline) ? (
                <div>
                  <h3> Place Your Bid! </h3>
                  <AddBidForm listingInfo={listing} />
                </div>
              ) : (
                <div>
                  <h3> Bid has ended. </h3>
                  <p> You can no longer bid for this item. </p>
                </div>
              )}
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              {hasExpired(deadline) ? (
                <div>
                  <h3> Ongoing Bids </h3>
                  <p> Sorted by price </p>
                </div>
              ) : (
                <div>
                  <h3> Past Bids </h3>
                </div>
              )}
              <BidTable value={listing} />
            </Col>
          </Row>
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
