import axios from "axios";
import { getCurrentSession } from "../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../const";

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
};

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

const deleteBid = async (listingId, bidPrice) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    await axios.delete(
      `${BIDDING_ENDPOINT}/deleteBid/${listingId}/${bidPrice}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateWinnerBid = async (listingId, bidPrice) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    await axios.put(
      `${BIDDING_ENDPOINT}/updateWinnerBid/${listingId}/${bidPrice}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return null;
  }
};

const addBid = async (newBid) => {
  try {
    // console.log(newBid);
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;
    await axios.post(`${BIDDING_ENDPOINT}/addBid`, newBid, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err) {
    console.log(err);
    return null;
  }
};

export {
  addBid,
  getListingBids,
  deleteBid,
  getAccountBids,
  getWinningBid,
  updateWinnerBid,
};
