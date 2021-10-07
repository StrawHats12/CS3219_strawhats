import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import { ListingsCarousel } from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import {
  deleteListing,
  deleteListingImages,
  getListing,
} from "../../services/listings-service";
import { formatDate, stringToDate } from "../../utils/DateTime";
import Countdown from "react-countdown";

const ListingsPage = () => {
  const { id } = useParams();
  const history = useHistory();

  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { listing_name, description, images, seller_uid, deadline } = listing;

  const handleCloseDeleteModal = () => setShowDeleteModal(false);
  const handleShowDeleteModal = () => setShowDeleteModal(true);
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
    console.log("Edit Pressed");
  };

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <p>Bidding has ended! ({formatDate(deadline)})</p>;
    } else {
      return (
        <span>
          Biding ends in {hours}:{minutes}:{seconds} ({formatDate(deadline)})
        </span>
      );
    }
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
      setIsLoading(false);
    });
  }, [id]);

  return (
    <>
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
        <Container>
          <h1>{listing_name}</h1>
          {isOwner && (
            <>
              <Button className="m-1" onClick={handleEdit}>
                Edit
              </Button>
              <Button className="m-1" onClick={handleShowDeleteModal}>
                Delete
              </Button>
            </>
          )}
          <Row>
            <Col>
              <ListingsCarousel seller_uid={seller_uid} imageUris={images} />
            </Col>
            <Col>
              <p>Current Bid: $100</p>
              {deadline && (
                <Countdown
                  date={stringToDate(deadline)}
                  renderer={countdownRenderer}
                />
              )}
            </Col>
          </Row>
          <Row>
            <p>{description}</p>
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
