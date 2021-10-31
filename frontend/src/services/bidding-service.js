import React, { useState } from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../const";
import Alert from '../components/Bids/Alert';

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

const deleteBid = async (bidId, bidPrice) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    await axios.delete(`${BIDDING_ENDPOINT}/deleteBid/${bidId}/${bidPrice}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateWinnerBid = async (bidId, bidPrice) => {
    try {
        const userSession = await getCurrentSession();
        const token = userSession?.accessToken.jwtToken;
        await axios.put(`${BIDDING_ENDPOINT}/updateWinnerBid/${bidId}/${bidPrice}`, {
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

    const [showDeclarative, setShowDeclarative] = useState(false);

    const handleDeclarative = () => {
        setShowDeclarative(!showDeclarative);
    }

    
    function handleChange(event) {
    setInput((prevInput) => {
        return {
        ...prevInput,
        [event.target.name]: event.target.value,
        };
    });
    }
    console.log(BIDDING_ENDPOINT);
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
            // bidDeadline: input.bidDeadline,
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
        <div>
            <h5> Bid Price: </h5>
            <input
                name="bidPrice"
                onChange={handleChange}
                autoComplete="off"
                value={input.bidPrice}
                className="form-control"
                placeholder="Enter Your Price Here"
                required
            />
            <br/>
            <Alert
                onConfirmOrDismiss={() => handleDeclarative()}
                show={showDeclarative}
                showCancelButton={true}
                onConfirm={() => handleClick()}
                text={input.bidPrice ?  'Do you really want to add bid?' : "Bid price cannot be empty "}
                title={input.bidPrice ? 'Confirm Bidding' : "Go back to listing."}
                type={'info'}
            />
            <button 
                type="submit" 
                onClick={ () => handleDeclarative()} 
                className="btn btn-success">
                {" "}
                Confirm Bid{" "}
            </button>        
        </div>
    )
};

export { AddBidForm, getListingBids, deleteBid, getAccountBids, getWinningBid, updateWinnerBid };
