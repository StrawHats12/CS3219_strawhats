import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useHistory, useParams } from "react-router";
import { ListingsCarousel } from "../../components/Listings";
import StrawhatSpinner from "../../components/StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import PopUp from "../../components/Bids/BidPopUp";
import BidTable from "../../components/Bids/BidTable";
import {
  deleteListing,
  deleteListingImages,
  getListing,
} from "../../services/listings-service";
import { formatDate, stringToDate } from "../../utils/DateTime";
import Countdown from "react-countdown";
import { ConsoleLogger } from "@aws-amplify/core";

const ListingsPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { listing_name, description, images, seller_uid, deadline} = listing;

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
    history.push(`/listings/edit/${id}`);
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
  }

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
        <Container fluid>
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
              <p>{description}</p>
            </Col>
            <Col>
              {deadline && (
                <Countdown
                  date={stringToDate(deadline)}
                  renderer={countdownRenderer}
                />
              )}
            </Col>
          </Row>
          <br/>
          <Row>
            <Col xs={2}> 
              { 
                isOwner
                  ?
                    <div>
                      <h3> Unable to Bid </h3>
                      <p> You cannot bid for your own items.</p>
                    </div>
                  : hasExpired(deadline) 
                    ?  
                    <div>
                      <h3> Place Your Bid! </h3>
                      <PopUp listingInfo = {listing}/>
                    </div>
                    :
                    <div>
                        <h3> Bid has ended. </h3>
                        <p> You can no longer bid for this item. </p>
                    </div> 
              }
            </Col>
            <Col xs={9}> 
              { hasExpired(deadline) 
                ?
                <div>
                  <h3> Ongoing Bids </h3> 
                </div>
                :
                <div>
                  <h3> Past Bids </h3> 
                </div>
              }  
              <BidTable value = {listing}/> 
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
