import React, { useEffect, useState } from "react";
import { getCurrentUser } from "../../hooks/useAuth";
import { getListingBids } from "../../services/bidding-service";
import { formatDate, formatTime } from "../../utils/DateTime";
import StrawhatSpinner from "../StrawhatSpinner";

const BidTable = ({ value }) => {
  const listingId = value.id;
  const [bids, setBids] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnameLoad, setIsUnameLoading] = useState(true);
  const [uname, setUname] = useState(null);

  useEffect(() => {
    getCurrentUser().then((res) => {
      if (!res) {
        setIsUnameLoading(false);
        return;
      }
      setUname(res.username);
      setIsUnameLoading(false);
    });
    getListingBids(listingId).then((res) => {
      if (!res) {
        setIsLoading(false);
        return;
      }
      setBids(res);
      setIsLoading(false);
    });
  }, [listingId]);

  const BidRow = ({
    bidOwner,
    bidCreationDate,
    bidExpiry,
    bidPrice,
    bidStatus,
    bidId,
  }) => {
    var profileLink = "http://localhost:3000/profile/" + bidOwner;
    return (
      <tr>
        <td>
          {" "}
          <a href={profileLink}> {bidOwner} </a>{" "}
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
          ) : new Date(value.deadline).getTime() < Date.now() ? (
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
    <div>
      {isLoading ? (
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
            {bids.map((bid) => (
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
    </div>
  );
};

export default BidTable;

// const columns = ([
//     {
//         Header: "Bid Id",
//         accessor: ""
//     },
//     {
//         Header: "Status",
//         accessor: "Status"
//     },
//     {
//         Header: "Date",
//         accessor: "createdAt"
//     },
//     {
//         Header: "Bid Owner",
//         accessor: "auctionId"
//     },
//     {
//         Header: "Price",
//         accessor: "bidPrice"
//     },
//     {
//         Header: "Bid Owner",
//         accessor: "bidOwner"
//     },
//     {
//         Header: "Bid Id",
//         accessor: "bidId"
//     }]);
