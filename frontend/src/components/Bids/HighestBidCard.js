import React, {useEffect, useState} from "react";
import { getWinningBid } from "../../services/bidding-service";
import StrawhatSpinner from "../StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../../const";
import Alert from './Alert';
import {updateWinnerBid} from "../../services/bidding-service"

const HighestBidCard = ({listingInfo}) => {
    const listingId = listingInfo.id;
    const [bid, setBid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uname, setUname] = useState(null);
    const [isUnameLoad, setIsUnameLoading] = useState(true);
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
            setUname(res.attributes.sub);
            setIsUnameLoading(false);
        });
        getWinningBid(listingId).then((res) => {
            if (!res) {
                setIsLoading(false);
                return;
            }
            setBid(res);
            setIsLoading(false);
        })
    }, []);

    async function handleClick(bidId, bidPrice) {
        return updateWinnerBid(bidId, bidPrice);
    }

    return (
        <div>
            {
            isLoading || isUnameLoad
            ? <StrawhatSpinner/>
            : bid[0] != undefined 
                ? new Date(listingInfo.deadline).getTime() < Date.now() 
                    ? listingInfo.seller_sub === uname
                        ?
                            ( // Winner is available and owner of listing
                                <>
                                <Alert
                                    onConfirmOrDismiss={() => handleDeclarative()}
                                    show={showDeclarative}
                                    showCancelButton={true}
                                    onConfirm={() => handleClick(bid[0].bidId, bid[0].bidPrice)}
                                    title={"Set the winner?"}
                                    text={"Do remember to contact your winner!"}
                                    type={'info'}
                                />
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /><div className="winningBidCard">
                                <div className="winningBid-card-header"> Winning Bid </div>
                                    <div className="winning-card-main">
                                        <i className="material-icons"> lens_blur </i>
                                        <a> {bid[0].bidOwner} </a>
                                        <p> Bid Price: ${bid[0].bidPrice} </p>
                                        <button onClick={ () => handleDeclarative()} className="btn btn-success"> Set Winner </button>
                                    </div>
                                </div>
                                </>
                            ) 
                            :
                            ( // Winner is available and not owner of listing
                                <>
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /><div className="winningBidCard">
                                <div className="winningBid-card-header"> Winning Bid </div>
                                    <div className="winning-card-main">
                                        <i className="material-icons"> lens_blur </i>
                                        <a> {bid[0].bidOwner} </a>
                                        <p> Bid Price: ${bid[0].bidPrice} </p>
                                        <p> Please wait for your seller to contact if you are the winner! </p>
                                    </div>
                                </div>
                                </>
                            ) 
                    : ( // Winner is available and unexpired listing
                        <>
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /><div className="winningBidCard">
                        <div className="winningBid-card-header"> Leading Bid </div>
                            <div className="winning-card-main">
                                <i className="material-icons"> lens_blur </i>
                                <a> {bid[0].bidOwner} </a>
                                <p> Bid Price: ${bid[0].bidPrice} </p>
                            </div>
                        </div>
                        </>
                    )
                : ( // No winner is available and expired listing
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
