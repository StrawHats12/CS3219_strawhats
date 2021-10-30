import React, {useEffect, useState} from "react";
import { getCurrentUser } from "../../hooks/useAuth";
import { getListingBids } from "../../services/bidding-service";
import { formatDate } from "../../utils/DateTime";
import StrawhatSpinner from "../StrawhatSpinner";
import { deleteBid } from "../../services/bidding-service";

const BidTable = ({value}) => {
    const listingId = value.id;
    const currentUsername = getCurrentUser().username;
    const [bids, setBids] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnameLoad, setIsUnameLoading] = useState(true);
    const [uname, setUname] = useState(null);
    console.log(value);
    useEffect( () => {
        getCurrentUser().then((res) => {
            if (!res) {
                setIsUnameLoading(false);
                return
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
    }, []);

    const handleDeleteClick = (bidId) => {
        return deleteBid(bidId);
    }

    const BidRow = ({bidOwner, bidCreationDate, bidExpiry, bidPrice, bidStatus, bidId}) => {
        var profileLink = "localhost:3000/profile/" + bidOwner;
        return (
        <tr>
            <td> <a href="{!'http://' + profileLink}"> {bidOwner} </a> </td>
            <td> {formatDate(bidCreationDate)} </td>
            <td> {bidExpiry} </td>
            <td> ${bidPrice} </td> 
            <td> 
                {
                    bidStatus == "ONGOING"
                        ? <button type="button" class="btn btn-success" disabled> ongoing </button>
                        : <button type="button" class="btn btn-secondary" disabled> expired </button>
                }
            </td>
            <td>
                { isUnameLoad 
                    ? <StrawhatSpinner/> 
                    : uname == bidOwner 
                        ? <button onClick={ () => handleDeleteClick(bidId)} class="btn btn-danger" > Delete </button> 
                        : <button type="button" class="btn btn-secondary" disabled> - </button>
                }
            </td>
        </tr>
        );
    }

    return(
    <div>
        {isLoading 
        ? <StrawhatSpinner/> 
        : (
            <table class="styled-table">
                <thead>
                    <tr>
                        <th> Bid Owner </th>
                        <th> Date of Bid </th>
                        <th> Bid Expiry Date </th>
                        <th> Price </th>
                        <th> Status </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    { bids.map( bid => 
                    <BidRow 
                        bidOwner = {bid.bidOwner}
                        bidCreationDate = {bid.createdAt}
                        bidExpiry = {bid.bidDeadline}
                        bidPrice = {bid.bidPrice}
                        bidStatus = {bid.status}
                        bidId = {bid.bidId}
                        /> 
                    )}
                </tbody>
            </table>
            )
        }
    </div>
    );
}

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