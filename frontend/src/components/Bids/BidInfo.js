import React, { useState, useCallback, useEffect } from "react";
import StrawhatSpinner from "../StrawhatSpinner";
import Alert from "./Alert";
import {
  addBid,
  getListingBids,
  updateWinnerBid,
} from "../../services/bidding-service";
import { getCurrentUser } from "../../hooks/useAuth";
import useBidSocket from "../../hooks/useBidSocket";
import { Col, Row } from "react-bootstrap";
import { formatDate, formatTime } from "../../utils/DateTime";
import { useHistory } from "react-router";

const BidInfo = ({ isOwner, deadline, listingInfo }) => {
  const history = useHistory();
  const [input, setInput] = useState({
    bidPrice: "",
  });

  const { socket } = useBidSocket({ listingId: listingInfo.id });

  const [winningBidPrice, setWinningBidPrice] = useState();
  const [winningBidOwner, setWinningBidOwner] = useState();

  var numbersVerifierRegex = /^[0-9]+$/;

  // for username
  const [uname, setUname] = useState(null);
  const [isUnameLoad, setIsUnameLoading] = useState(true);

  // for input bid alert
  const [showAddBidDeclarative, setShowAddBidDeclarative] = useState(false);
  const [showIncorrectDeclarative, setShowIncorrectDeclarative] =
    useState(false);

  // for Winning Bid card alert
  const [showSetWinDeclarative, setShowSetWinDeclarative] = useState(false);

  // to render in the table
  const [runningBids, setRunningBids] = useState(null);
  const [isLoadRunningBids, setIsLoadRunningBids] = useState(true);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (!res) {
        setIsUnameLoading(false);
        return;
      }
      setUname(res.username);
      setIsUnameLoading(false);
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
      setWinningBidPrice(res[0] !== undefined ? res[0].bidPrice : "0");
      setWinningBidOwner(res[0] !== undefined ? res[0].bidOwner : "No bidders");
      setIsLoadRunningBids(false);
    });
  }, [listingInfo.id]);

  // retrieve bids real time from socket for the listing
  const addNewBidToRunningBids = useCallback(
    (newBid) => {
      if (newBid.listingId !== listingInfo.id) return;
      setRunningBids([...runningBids, newBid]);
      runningBids.sort((bidOne, bidTwo) => bidOne.bidPrice + bidTwo.bidPrice);
      setWinningBidPrice(newBid.bidPrice);
      setWinningBidOwner(newBid.bidOwner);
    },
    [runningBids, listingInfo.id]
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
      handleCloseAddBidAlert();
      const newBid = {
        bidOwner: uname,
        listingId: listingInfo.id,
        bidPrice: input.bidPrice,
        auctionId: listingInfo.bidding_id,
        status: "ONGOING",
        createdAt: Date.now(),
      };
      socket.emit("add-bid", newBid); // convey to socket
      addNewBidToRunningBids(newBid);
      addBid(newBid); // add to back end
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  const handleOpenAddBidAlert = () => {
    setShowAddBidDeclarative(true);
  };

  const handleCloseAddBidAlert = () => {
    setShowAddBidDeclarative(false);
  };

  const handleIncorrectDeclarative = () => {
    setShowIncorrectDeclarative(!showIncorrectDeclarative);
  };

  const handleSetWinDeclarative = () => {
    setShowSetWinDeclarative(!showSetWinDeclarative);
  };

  const hasExpired = (deadline) => {
    return Date.parse(deadline) > Date.now();
  };

  async function handleWinnerClick(listingId, bidPrice) {
    return updateWinnerBid(listingId, bidPrice);
  }

  const redirectToMessageChat = async (bidOwner) => {
    if (bidOwner) {
      history.push(`/messenger/?user=${bidOwner}`);
    } else {
      alert("User profile not found.");
    }
  };

  const redirectToWinnerProfile = async (bidOwner) => {
    if (bidOwner) {
      history.push(`/profile/${bidOwner}`);
    } else {
      alert("User profile not found.");
    }
  };

  const BidRow = ({ bidOwner, bidCreationDate, bidPrice, bidStatus }) => {
    return (
      <tr>
        <td>
          {" "}
          <a href={redirectToWinnerProfile}> {bidOwner} </a>{" "}
        </td>
        <td>
          {" "}
          {formatDate(bidCreationDate)} @ {formatTime(bidCreationDate)}{" "}
        </td>
        <td> ${bidPrice} </td>
        <td>
          {bidStatus === "WINNER" ? (
            <button type="button" className="btn btn-success" disabled>
              {" "}
              Winner{" "}
            </button>
          ) : new Date(deadline).getTime() < Date.now() ? (
            <button type="button" className="btn btn-secondary" disabled>
              {" "}
              expired{" "}
            </button>
          ) : (
            <button type="button" className="btn btn-success" disabled>
              {" "}
              ongoing{" "}
            </button>
          )}
        </td>
        <td>
          {isUnameLoad ? (
            <StrawhatSpinner />
          ) : uname === bidOwner ? (
            <button type="button" className="btn btn-secondary" disabled>
              {" "}
              -{" "}
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" disabled>
              {" "}
              -{" "}
            </button>
          )}
        </td>
      </tr>
    );
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
                {isUnameLoad ? (
                  <StrawhatSpinner />
                ) : (
                  <>
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
                    <Alert
                      onDismiss={handleCloseAddBidAlert}
                      show={showAddBidDeclarative}
                      showCancelButton={true}
                      onConfirm={handleClick}
                      text={"Do you really want to add bid?"}
                      title={"Confirm Bidding."}
                    />
                    <Alert
                      onDismiss={handleIncorrectDeclarative}
                      onConfirm={handleIncorrectDeclarative}
                      show={showIncorrectDeclarative}
                      title={"Incorrect input."}
                      text={`Ensure that your bid price is no lower than $${winningBidPrice}`}
                    />
                    <br />
                    <button
                      onClick={
                        input.bidPrice.match(numbersVerifierRegex) !== null &&
                        parseInt(input.bidPrice) > parseInt(winningBidPrice)
                          ? () => handleOpenAddBidAlert()
                          : handleIncorrectDeclarative
                      }
                      className="btn btn-success"
                    >
                      {" "}
                      Confirm Bid{" "}
                    </button>
                  </>
                )}
              </div>{" "}
            </>
          ) : (
            <div>
              <h3> Bid has ended.</h3>
              <p> You can no longer bid for this item.</p>
            </div>
          )}
        </Col>
        <Col>
          <>
            {isUnameLoad ? (
              <StrawhatSpinner />
            ) : winningBidOwner !== "" ? (
              new Date(deadline).getTime() < Date.now() ? (
                isOwner ? (
                  // Winner is available and owner of listing
                  <>
                    <Alert
                      onConfirmOrDismiss={handleSetWinDeclarative}
                      show={showSetWinDeclarative}
                      showCancelButton={true}
                      onConfirm={() => {
                        handleSetWinDeclarative();
                        handleWinnerClick(listingInfo.id, winningBidPrice);
                      }}
                      title={"Set the winner?"}
                      text={"Do remember to contact your winner!"}
                    />
                    <link
                      href="https://fonts.googleapis.com/icon?family=Material+Icons"
                      rel="stylesheet"
                    />
                    <div className="winningBidCard">
                      <div className="winningBid-card-header">
                        {" "}
                        Winning Bid{" "}
                      </div>
                      <div className="winning-card-main">
                        <i className="material-icons"> lens_blur </i>
                        <p> {winningBidOwner} </p>
                        <p> Bid Price: ${winningBidPrice} </p>
                        <div style={{ display: "flex" }}>
                          <button
                            onClick={() => handleSetWinDeclarative()}
                            className="btn btn-success"
                            style={{ marginRight: 10 }}
                          >
                            Set Winner
                          </button>
                          <button
                            onClick={() =>
                              redirectToMessageChat(winningBidOwner)
                            }
                            className="btn btn-primary"
                            style={{ marginLeft: 10 }}
                          >
                            Talk to Winner
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Winner is available and not owner of listing
                  <>
                    <link
                      href="https://fonts.googleapis.com/icon?family=Material+Icons"
                      rel="stylesheet"
                    />
                    <div className="winningBidCard">
                      <div className="winningBid-card-header">
                        {" "}
                        Winning Bid{" "}
                      </div>
                      <div className="winning-card-main">
                        <i className="material-icons"> lens_blur </i>
                        <p> {winningBidOwner} </p>
                        <p> Bid Price: ${winningBidPrice} </p>
                        <p>
                          {" "}
                          Please wait for your seller to contact if you are the
                          winner!{" "}
                        </p>
                      </div>
                    </div>
                  </>
                )
              ) : (
                // Winner is available and unexpired listing
                <>
                  <link
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                    rel="stylesheet"
                  />
                  <div className="winningBidCard">
                    <div className="winningBid-card-header"> Leading Bid </div>
                    <div className="winning-card-main">
                      <i className="material-icons"> lens_blur </i>
                      <p> {winningBidOwner} </p>
                      <p> Bid Price: ${winningBidPrice} </p>
                    </div>
                  </div>
                </>
              )
            ) : (
              // No winner is available and expired listing
              <>
                <link
                  href="https://fonts.googleapis.com/icon?family=Material+Icons"
                  rel="stylesheet"
                />
                <div className="winningBidCard">
                  <div className="winningBid-card-header"> Winning Bid </div>
                  <div className="winning-card-main">
                    <i className="material-icons"> lens_blur </i>
                    <p> No Bidders </p>
                  </div>
                </div>
              </>
            )}
          </>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          {isLoadRunningBids ? (
            <StrawhatSpinner />
          ) : (
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
                {runningBids.map((bid) => (
                  <BidRow
                    key={bid.bidId}
                    bidOwner={bid.bidOwner}
                    bidCreationDate={bid.createdAt}
                    bidPrice={bid.bidPrice}
                    bidStatus={bid.status}
                    bidId={bid.bidId}
                  />
                ))}
              </tbody>
            </table>
          )}
        </Col>
      </Row>
    </>
  );
};

export default BidInfo;
