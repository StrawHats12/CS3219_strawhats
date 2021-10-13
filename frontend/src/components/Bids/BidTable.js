import { ConsoleLogger } from "@aws-amplify/core";
import React, {useEffect, useState} from "react";
import { useTable } from 'react-table';
import { getCurrentUser } from "../../hooks/useAuth";
import { getListingBids } from "../../services/bidding-service";
import { formatDate } from "../../utils/DateTime";
import StrawhatSpinner from "../StrawhatSpinner";

const BidTable = ({value}) => {
    const listingId = value.id;
    const currentUsername = getCurrentUser().username;
    const [bids, setBids] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnameLoad, setIsUnameLoading] = useState(true);
    const [uname, setUname] = useState(null);

    useEffect( () => {
        getCurrentUser().then((res) => {
            if (!res) {
                setIsUnameLoading(false);
                return
            }
            setUname(res.username);
            setIsUnameLoading(false);
        })
        getListingBids(listingId).then((res) => {
            if (!res) {
                setIsLoading(false);
                return;
            }
            setBids(res);
            setIsLoading(false);
        });
    }, []);

    return(
    <div>
        {isLoading 
        ? <StrawhatSpinner/> 
        : (
            <table>
                <thead>
                    <tr>
                        <th> Bid Owner </th>
                        <th> Date of Bid </th>
                        <th> Price </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    { bids.map( bid => 
                    <tr>
                        <td> {bid.bidOwner} </td>
                        <td> {formatDate(bid.createdAt)} </td>
                        <td> {bid.bidPrice} </td> 
                        <td>
                            { isUnameLoad 
                                ? <StrawhatSpinner/> 
                                : uname == bid.bidOwner 
                                    ? <button> Delete </button> 
                                    : "Profile Link to be inserted"
                            }
                        </td>
                    </tr>
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