import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../const";
import Alert from '../components/Bids/Alert';
import StrawhatSpinner from "../components/StrawhatSpinner";

const getWinningBid = async (listingId) => {
    try {
        const userSession = await getCurrentSession();
        const token = userSession?.accessToken.jwtToken;
        const response = await axios.get(
          `${BIDDING_ENDPOINT}/getWinningBid/${listingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response?.data?.Items;
        return data;
      } catch (error) {
        console.log(error);
        return null;
      }
}

const getListingBids = async (listingId) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const response = await axios.get(
      `${BIDDING_ENDPOINT}/getListingBids/${listingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response?.data?.Items;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const getAccountBids = async (uname) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    const response = await axios.get(
      `${BIDDING_ENDPOINT}/getAccountBids/${uname}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response?.data?.Items;
    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const deleteBid = async (listingId, bidPrice) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    await axios.delete(`${BIDDING_ENDPOINT}/deleteBid/${listingId}/${bidPrice}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateWinnerBid = async (listingId, bidPrice) => {
    try {
        const userSession = await getCurrentSession();
        const token = userSession?.accessToken.jwtToken;
        await axios.put(`${BIDDING_ENDPOINT}/updateWinnerBid/${listingId}/${bidPrice}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    } catch (error) {
        console.log(error);
        return null;
    }
}

const AddBidForm = ({listingInfo}) => {
    const [input, setInput] = useState({
        bidPrice: "",
    });

    const [winningBidPrice, setWinningBidPrice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeclarative, setShowDeclarative] = useState(false);
    const [showIncorrectDeclarative, setShowIncorrectDeclarative] = useState(false);
    
    var numbersVerifierRegex = /^[0-9]+$/;
    const handleDeclarative = () => {
      setShowDeclarative(!showDeclarative);
    }

    const handleIncorrectDeclarative = () => {
      setShowIncorrectDeclarative(!showIncorrectDeclarative);
    }

    useEffect( () => {
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
      })
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
          const userSession = await getCurrentSession();
          const currentUser = await getCurrentUser();
          const token = userSession?.accessToken.jwtToken;
          const newBid = {
            listingId: listingInfo.id,
            userIdentifier: currentUser.username,
            bidPrice: input.bidPrice,
            auctionId: listingInfo.bidding_id,
            status: "ONGOING",
          };
          await axios.post(`${BIDDING_ENDPOINT}/addBid`, newBid, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (err) {
          console.log(err);
          return null;
        }
      }

    return ( 
      <>
        {
          <div>
              <h5> Bid Price: </h5>
              { 
                isLoading
                ? <StrawhatSpinner/> 
                : <input
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
              }
              <Alert
                  onConfirmOrDismiss={() => handleDeclarative("hi")}
                  show={showDeclarative}
                  showCancelButton={true}
                  onConfirm={() => handleClick()}
                  text={'Do you really want to add bid?'}
                  title={"Confirm Bidding."}
                  type={'info'}
              />
              <Alert
                  onConfirmOrDismiss={() => handleIncorrectDeclarative()}
                  show={showIncorrectDeclarative}
                  title={"Incorrect input."}
                  text={`Ensure that your bid price is no lower than $${winningBidPrice}`}
                  type={'info'}
              />
              <button 
                  onClick={ input.bidPrice.match(numbersVerifierRegex) !== null 
                              && input.bidPrice > winningBidPrice 
                                ? () => handleDeclarative() 
                                : () => handleIncorrectDeclarative() } 
                  className="btn btn-success">
                  {" "}
                  Confirm Bid{" "}
              </button> 
          </div>
        }
      </>
    )
};

export { AddBidForm, getListingBids, deleteBid, getAccountBids, getWinningBid, updateWinnerBid };
