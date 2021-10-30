import React, {useEffect, useState} from "react";
import { getCurrentUser } from "../../hooks/useAuth";
import { getAccountBids } from "../../services/bidding-service";
import { formatDate, formatTime } from "../../utils/DateTime";
import StrawhatSpinner from "../StrawhatSpinner";
import { deleteBid } from "../../services/bidding-service";
import Alert from './Alert';

const UserBidTable = () => {
    const [bids, setBids] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isUnameLoad, setIsUnameLoading] = useState(true);
    const [uname, setUname] = useState(null);
    const [showDeclarative, setShowDeclarative] = useState(false);

    const handleDeclarative = () => {
        setShowDeclarative(!showDeclarative);
    }

    useEffect( () => {
        getCurrentUser().then((res) => {
            if (!res) {
                setIsUnameLoading(false);
                return
            }
            setUname(res.username);
            setIsUnameLoading(false);
            return res.username;
        }).then((uname) => {
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

    
    const handleDeleteClick = (bidId) => {
        return deleteBid(bidId);
    }    

    const BidRow = ({bidOwner, bidCreationDate, bidExpiry, bidPrice, bidStatus, bidId, listingId}) => {
        console.log(listingId);
        var listingLink = "http://localhost:3000/listings/" + listingId;
        return (
        <tr> 
            <td> <a href={listingLink}> Visit Listing </a> </td>
            <td> {formatDate(bidCreationDate)} @ {formatTime(bidCreationDate)} </td>
            <td> {formatDate(bidExpiry)} @ {formatTime(bidExpiry)} </td>
            <td> ${bidPrice} </td> 
            <td> 
                {
                    new Date(bidExpiry).getTime() < Date.now() 
                        ? <button type="button" className="btn btn-secondary" disabled> expired </button>
                        : bidStatus === "ONGOING"
                            ? <button type="button" className="btn btn-success" disabled> ongoing </button>
                            : <button type="button" className="btn btn-success" disabled> nothing </button>
                }
            </td>
            <td>
                { 
                    isUnameLoad 
                    ? <StrawhatSpinner/> 
                    : uname === bidOwner 
                        ? ( <div>
                                <Alert
                                    onConfirmOrDismiss={() => handleDeclarative()}
                                    show={showDeclarative}
                                    showCancelButton={true}
                                    onConfirm={() => handleDeleteClick(bidId)}
                                    text={'Do you really want to delete?'}
                                    title={'Confirm Deletion'}
                                    type={'info'}
                                />
                                <button onClick={ () => handleDeclarative()} className="btn btn-danger" > Delete </button> 
                            </div>
                        )
                        : <button type="button" className="btn btn-secondary" disabled> - </button>
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
            <table className="styled-table">
                <thead>
                    <tr>
                        <th> Listing </th>
                        <th> Date of Bid </th>
                        <th> Bid Expiry </th>
                        <th> Price </th>
                        <th> Status </th>
                        <th> Action </th>
                    </tr>
                </thead>
                <tbody>
                    { bids.map( bid => 
                    <BidRow key = {bid.bidId}
                        bidOwner = {bid.bidOwner}
                        bidCreationDate = {bid.createdAt}
                        bidExpiry = {bid.bidDeadline}
                        bidPrice = {bid.bidPrice}
                        bidStatus = {bid.status}
                        bidId = {bid.bidId}
                        listingId = {bid.auctionId}
                        /> 
                    )}
                </tbody>
            </table>
            )
        }
    </div>
    );
}

export default UserBidTable;
