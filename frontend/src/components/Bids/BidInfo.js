import React, { useState, useCallback, useEffect } from "react";
import StrawhatSpinner from "../StrawhatSpinner";
import Alert from "./Alert";
import { addBid, getWinningBid, getListingBids } from "../../services/bidding-service";
import { getCurrentUser } from "../../hooks/useAuth";
import useBidSocket from "../../hooks/useBidSocket";
import { Col, Row } from "react-bootstrap";
import { formatDate, formatTime } from "../../utils/DateTime";

const BidInfo = ({ isOwner, deadline, listingInfo }) => {
  const [input, setInput] = useState({
    bidPrice: "",
  });

  const { socket } = useBidSocket({ listingId: listingInfo.id });

  // for add bidding 
  const [winningBidPrice, setWinningBidPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  var numbersVerifierRegex = /^[0-9]+$/;

  // for username
  const [uname, setUname] = useState(null);
  const [isUnameLoad, setIsUnameLoading] = useState(true);

  // for alert
  const [showDeclarative, setShowDeclarative] = useState(false);
  const [showIncorrectDeclarative, setShowIncorrectDeclarative] = useState(false);

   // to render in the table
   const [runningBids, setRunningBids] = useState(null);
   const [isLoadRunningBids, setIsLoadRunningBids] = useState(true);

  // retrieve winning bid & username
  useEffect(() => {
    getCurrentUser().then((res) => {
      if (!res) {
          setIsUnameLoading(false);
          return
      }
      setUname(res.username);
      setIsUnameLoading(false);
    });
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

  // retrieve existing bids of the listing
  useEffect(() => {
    getListingBids(listingInfo.id).then((res) => {
      if (!res) {
        setIsLoadRunningBids(false);
        return;
      }
      setRunningBids(res);
      setIsLoadRunningBids(false);
    });
  }, []);

  // retrieve bids real time from socket for the listing
  const addNewBidToRunningBids = useCallback(
    (newBid) => {
      if (newBid.listingId != listingInfo.id) 
        return
      setRunningBids([...runningBids, newBid]);
      runningBids.sort((bidOne, bidTwo) => bidOne.bidPrice - bidTwo.bidPrice);
    }, [runningBids]
  );

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-new-bid", addNewBidToRunningBids);
    return () => socket.off("receive-new-bid");
  }, [addNewBidToRunningBids, socket]);

  // Component support
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
      socket.emit("add-bid", newBid); // convey to socket
      addBid(newBid); // add to back end
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const handleDeclarative = () => {
    setShowDeclarative(!showDeclarative);
  };

  const handleIncorrectDeclarative = () => {
    setShowIncorrectDeclarative(!showIncorrectDeclarative);
  };

  const hasExpired = (deadline) => {
    return Date.parse(deadline) > Date.now();
  };

  const BidRow = ({bidOwner, bidCreationDate, bidPrice, bidStatus}) => {
    var profileLink = "http://localhost:3000/profile/" + bidOwner;
    return (
    <tr> 
        <td> <a href={profileLink}> {bidOwner} </a> </td>
        <td> {formatDate(bidCreationDate)} @ {formatTime(bidCreationDate)} </td>
        <td> ${bidPrice} </td> 
        <td> 
            {
                bidStatus === "WINNER"
                ? <button type="button" className="btn btn-success" disabled> Winner </button>
                : new Date(deadline).getTime() < Date.now() 
                    ? <button type="button" className="btn btn-secondary" disabled> expired </button>
                    : <button type="button" className="btn btn-success" disabled> ongoing </button>
            }
        </td>
        <td>
            { 
                isUnameLoad 
                ? <StrawhatSpinner/> 
                : uname === bidOwner 
                    ? ( <button type="button" className="btn btn-secondary" disabled> - </button> )
                    : <button type="button" className="btn btn-secondary" disabled> - </button>
            }
        </td>
    </tr>
    );
  }

  return (
    <>
      <Row>
        <Col>
        { isOwner 
          ? (<div>
              <h3> Unable to Bid </h3>
              <p> You cannot bid for your own items.</p>
            </div>)
          : hasExpired(deadline) 
            ? (<>
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
              </>) 
            : (
                <div>
                  <h3> Bid has ended.</h3>
                  <p> You can no longer bid for this item.</p>
                </div>
              )
        }
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          {
            isLoadRunningBids 
            ? <StrawhatSpinner/> 
            : (
                <table className="styled-table">
                  <thead>
                      <tr>
                          <th> Bid Owner </th>
                          <th> Date of Bid </th>
                          <th> Price </th>
                          <th> Status </th>
                          <th> Action </th>
                      </tr>
                  </thead>
                  <tbody>
                    { 
                      runningBids.map( bid => 
                      <BidRow key = {bid.bidId}
                          bidOwner = {bid.bidOwner}
                          bidCreationDate = {bid.createdAt}
                          bidPrice = {bid.bidPrice}
                          bidStatus = {bid.status}
                          bidId = {bid.bidId}
                          />)
                    }
                  </tbody>
                </table>
              )
          }
        </Col>
      </Row>
    </>
  );
};

export default BidInfo;