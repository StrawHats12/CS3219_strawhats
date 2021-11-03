import React, { useState, useEffect } from "react";
import StrawhatSpinner from "../StrawhatSpinner";
import Alert from "./Alert";
import { addBid, getWinningBid } from "../../services/bidding-service";
import { getCurrentUser } from "../../hooks/useAuth";
import useBidSocket from "../../hooks/useBidSocket";
import { Button, Col, Row } from "react-bootstrap";

const BidInfo = ({ isOwner, deadline, listingInfo }) => {
  const [input, setInput] = useState({
    bidPrice: "",
  });

  const { socket } = useBidSocket({ listingId: listingInfo.id });
  const [winningBidPrice, setWinningBidPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeclarative, setShowDeclarative] = useState(false);
  const [showIncorrectDeclarative, setShowIncorrectDeclarative] =
    useState(false);

  var numbersVerifierRegex = /^[0-9]+$/;

  const handleDeclarative = () => {
    setShowDeclarative(!showDeclarative);
  };

  const handleIncorrectDeclarative = () => {
    setShowIncorrectDeclarative(!showIncorrectDeclarative);
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-new-bid", (bid) => console.log("hello"));
    return () => socket.off("receive-new-bid");
  }, [socket]);

  useEffect(() => {
    getWinningBid(listingInfo.id).then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }
      if (res[0]) {
        setWinningBidPrice(res[0].bidPrice);
      } else {
        setWinningBidPrice(0);
      }
      setIsLoading(false);
    });
  }, []);

  function handleChange(event) {
    setInput((prevInput) => {
      return {
        ...prevInput,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleClick() {
    try {
      const currentUser = await getCurrentUser();
      const newBid = {
        listingId: listingInfo.id,
        userIdentifier: currentUser.username,
        bidPrice: input.bidPrice,
        auctionId: listingInfo.bidding_id,
        status: "ONGOING",
      };
      socket.emit("add-bid", newBid);
      // addBid(newBid);
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const hasExpired = (deadline) => {
    return Date.parse(deadline) > Date.now();
  };

  return (
    <>
      <Row>
        <Col>
          {isOwner ? (
            <div>
              <h3> Unable to Bid </h3>
              <p> You cannot bid for your own items.</p>
            </div>
          ) : hasExpired(deadline) ? (
            <>
              {" "}
              <h3> Place Your Bid! </h3>
              <div>
                <h5> Bid Price: </h5>
                {isLoading ? (
                  <StrawhatSpinner />
                ) : (
                  <input
                    name="bidPrice"
                    type="number"
                    onChange={handleChange}
                    autoComplete="off"
                    value={input.bidPrice}
                    className="form-control"
                    placeholder="Enter Your Price Here"
                    min={winningBidPrice}
                    required
                  />
                )}
                <Alert
                  onConfirmOrDismiss={() => handleDeclarative("hi")}
                  show={showDeclarative}
                  showCancelButton={true}
                  onConfirm={() => handleClick()}
                  text={"Do you really want to add bid?"}
                  title={"Confirm Bidding."}
                  type={"info"}
                />
                <Alert
                  onConfirmOrDismiss={() => handleIncorrectDeclarative()}
                  show={showIncorrectDeclarative}
                  title={"Incorrect input."}
                  text={`Ensure that your bid price is no lower than $${winningBidPrice}`}
                  type={"info"}
                />
                <br />
                <button
                  onClick={
                    input.bidPrice.match(numbersVerifierRegex) !== null &&
                    input.bidPrice > winningBidPrice
                      ? () => handleDeclarative()
                      : () => handleIncorrectDeclarative()
                  }
                  className="btn btn-success"
                >
                  {" "}
                  Confirm Bid{" "}
                </button>
              </div>{" "}
            </>
          ) : (
            <div>
              <h3> Bid has ended.</h3>
              <p> You can no longer bid for this item.</p>
            </div>
          )}
        </Col>
      </Row>
      <hr />
      <Row>
        <Col></Col>
      </Row>
    </>
  );
};

export default BidInfo;
