import React, {useEffect, useState} from "react";
import { getWinningBid } from "../../services/bidding-service";
import StrawhatSpinner from "../StrawhatSpinner";
import { getCurrentUser } from "../../hooks/useAuth";
import Alert from './Alert';
import {updateWinnerBid} from "../../services/bidding-service"
import { useHistory } from "react-router";

const HighestBidCard = ({listingInfo}) => {
    const listingId = listingInfo.id;
    const history = useHistory();
    const [bid, setBid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [uname, setUname] = useState(null);
    const [isUnameLoad, setIsUnameLoading] = useState(true);
    const [showDeclarative, setShowDeclarative] = useState(false);

    const handleDeclarative = () => {
        setShowDeclarative(!showDeclarative);
    }

    const redirectToChat = async (bidOwner) => {
        if (bidOwner) {
          history.push(`/messenger/?user=${bidOwner}`);
        } else {
          alert("User profile not found.");
        }
      };

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

    async function handleClick(listingId, bidPrice) {
        return updateWinnerBid(listingId, bidPrice);
    }

    return (
        <>
            {
            isLoading || isUnameLoad
            ? <StrawhatSpinner/>
            :  bid === null || bid[0] !== undefined 
                ? new Date(listingInfo.deadline).getTime() < Date.now() 
                    ? listingInfo.seller_sub === uname
                        ?
                            ( // Winner is available and owner of listing
                                <>
                                <Alert
                                    onConfirmOrDismiss={() => handleDeclarative()}
                                    show={showDeclarative}
                                    showCancelButton={true}
                                    onConfirm={() => handleClick(bid[0].listingId, bid[0].bidPrice)}
                                    title={"Set the winner?"}
                                    text={"Do remember to contact your winner!"}
                                    type={'info'}
                                />
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                                <div className="winningBidCard">
                                <div className="winningBid-card-header"> Winning Bid </div>
                                    <div className="winning-card-main">
                                        <i className="material-icons"> lens_blur </i>
                                        <a> {bid[0].bidOwner} </a>
                                        <p> Bid Price: ${bid[0].bidPrice} </p>
                                        <div style={{display: 'flex'}}>
                                            <button onClick={ () => handleDeclarative()} className="btn btn-success" style={{marginRight: 10}}> Set Winner </button>
                                            <button onClick={ () => redirectToChat(bid[0].bidOwner)} className="btn btn-primary" style={{marginLeft: 10}}> Talk to Winner </button>
                                        </div>
                                    </div>
                                </div>
                                </>
                            ) 
                            :
                            ( // Winner is available and not owner of listing
                                <>
                                <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                                <div className="winningBidCard">
                                <div className="winningBid-card-header"> Winning Bid </div>
                                    <div className="winning-card-main">
                                        <i className="material-icons"> lens_blur </i>
                                        <a> {bid[0].bidOwner} </a>
                                        <p> Bid Price: ${bid[0].bidPrice} </p>
                                        <a> Please wait for your seller to contact if you are the winner! </a>
                                    </div>
                                </div>
                                </>
                            ) 
                    : ( // Winner is available and unexpired listing
                        <>
                        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                        <div className="winningBidCard">
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
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
                    <div className="winningBidCard">
                    <div className="winningBid-card-header"> Winning Bid </div>
                        <div className="winning-card-main">
                            <i className="material-icons"> lens_blur </i>
                            <a> No Bidders </a>
                        </div>
                    </div>
                    </>
                )
                
            }
        </>
    );
}

export default HighestBidCard;
