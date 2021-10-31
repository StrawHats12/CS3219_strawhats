import React, { useState } from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../hooks/useAuth";
import { formatTDateTime } from "../utils/DateTime";
import { BIDDING_ENDPOINT } from "../const";

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
};

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

const AddBid = ({ listingInfo, toggleModal }) => {
  const currentdate = new Date();
  var datetime =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    "T" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes();

  const [input, setInput] = useState({
    bidPrice: "",
    bidDeadline: datetime,
  });

  function handleChange(event) {
    setInput((prevInput) => {
      return {
        ...prevInput,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleClick(event) {
    event.preventDefault();
    try {
      const userSession = await getCurrentSession();
      const currentUser = await getCurrentUser();
      const token = userSession?.accessToken.jwtToken;
      const newBid = {
        listingId: listingInfo.id,
        userIdentifier: currentUser.username,
        bidPrice: input.bidPrice,
        auctionId: listingInfo.bidding_id,
        bidDeadline: input.bidDeadline,
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
    <div className="container">
      <h1> Place Your Bid </h1>
      <br />
      <form onSubmit={handleClick}>
        <div className="form-group">
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
        </div>
        <br />
        <h5> Bid End Date: </h5>
        <p>
          {" "}
          You may choose a date beyond the listing's end date to ensure your bid
          does not expire.{" "}
        </p>
        <input
          type="datetime-local"
          name="bidDeadline"
          value={input.bidDeadline}
          onChange={handleChange}
          min={formatTDateTime(listingInfo.createdAt)}
          format="yyyy-MM-ddTHH:mm"
          required
        />
        <br /> <br />
        <button type="submit" className="btn btn-success">
          {" "}
          Confirm Bid{" "}
        </button>
      </form>
      <br />
      <button onClick={toggleModal} className="btn btn-dark">
        {" "}
        Close{" "}
      </button>
    </div>
  );
};

export { AddBid, getListingBids, deleteBid, getAccountBids };
