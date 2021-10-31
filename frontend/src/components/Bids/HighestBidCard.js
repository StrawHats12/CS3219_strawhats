import React, {useEffect, useState} from "react";
import { getWinningBid } from "../../services/bidding-service";
import StrawhatSpinner from "../StrawhatSpinner";

const HighestBidCard = ({listingInfo}) => {
    
    const listingId = listingInfo.id;
    const [bid, setBid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect( () => {
        getWinningBid(listingId).then((res) => {
            if (!res) {
                setIsLoading(false);
                return;
            }
            setBid(res);
            setIsLoading(false);
        })
    }, []);

    return (
        <div>
            {
            isLoading 
            ? <StrawhatSpinner/>
            : bid[0] != undefined 
                ? (
                    <>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /><div className="winningBidCard">
                    <div className="winningBid-card-header"> Winning Bid </div>
                        <div className="winning-card-main">
                            <i className="material-icons"> lens_blur </i>
                            <a> {bid[0].bidOwner} </a>
                            <p> Bid Price: ${bid[0].bidPrice} </p>
                        </div>
                    </div>
                    </>
                ) 
                : (
                    <>
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /><div className="winningBidCard">
                    <div className="winningBid-card-header"> Winning Bid </div>
                        <div className="winning-card-main">
                            <i className="material-icons"> lens_blur </i>
                            <a> No Bidders </a>
                        </div>
                    </div>
                    </>
                )
            
            }
        </div>
    );
}

export default HighestBidCard;
