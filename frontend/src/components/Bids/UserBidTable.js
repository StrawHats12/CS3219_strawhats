import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../hooks/useAuth";
import { getAccountBids } from "../../services/bidding-service";
import { formatDate, formatTime } from "../../utils/DateTime";
import StrawhatSpinner from "../StrawhatSpinner";
import { getListing } from "../../services/listings-service";

const UserBidTable = () => {
  const [bids, setBids] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        return res.username;
      })
      .then((uname) => {
        getAccountBids(uname).then((res) => {
          if (!res) {
            setIsLoading(false);
            return;
          }
          setBids(res);
          setIsLoading(false);
        });
      });
  }, []);

  async function isListingExpired(listingId) {
    var listing = await getListing(listingId);
    return new Date(listing.deadline).getTime() < Date.now();
  }

  const BidRow = ({ bidCreationDate, bidPrice, bidStatus, listingId }) => {
    const listingLink = `/listings/${listingId}`;
    return (
      <tr>
        <td>
          {" "}
          <a href={listingLink}>
            {" "}
            <button className="btn btn-success">Visit Listing </button>{" "}
          </a>{" "}
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
          ) : isListingExpired(listingId) ? (
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
      </tr>
    );
  };

  return (
    <div>
      {isLoading ? (
        <StrawhatSpinner />
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th> Listing </th>
              <th> Date of Bid </th>
              <th> Price </th>
              <th> Status </th>
            </tr>
          </thead>
          <tbody>
            {bids.map((bid) => (
              <BidRow
                key={bid.bidId}
                bidCreationDate={bid.createdAt}
                bidPrice={bid.bidPrice}
                bidStatus={bid.status}
                listingId={bid.auctionId}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserBidTable;
