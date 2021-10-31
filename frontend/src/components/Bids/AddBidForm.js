import React, { useState } from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../../const";
import Alert from './Alert';

const AddBidForm = ({listingInfo}) => {
    
    const [input, setInput] = useState({
        bidPrice: "",
    });

    const [showDeclarative, setShowDeclarative] = useState(false);

    const handleDeclarative = () => {
        setShowDeclarative(!showDeclarative);
    }

    const placerFunction = () => {return;}
    
    function handleChange(event) {
    setInput((prevInput) => {
        return {
        ...prevInput,
        [event.target.name]: event.target.value,
        };
    });
    }
    
    async function handleClick() {
        try {
          const userSession = await getCurrentSession();
          const currentUser = await getCurrentUser();
          const token = userSession?.accessToken.jwtToken;
          const newBid = {
            listingId: listingInfo.id,
            userIdentifier: currentUser.username,
            bidPrice: input.bidPrice,
            auctionId: listingInfo.bidding_id,
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
        <div>
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
            <br/>
            <Alert
                onConfirmOrDismiss={() => handleDeclarative()}
                show={showDeclarative}
                showCancelButton={true}
                onConfirm={input.bidPrice ? () => handleClick() : () => placerFunction()}
                text={input.bidPrice ?  'Do you really want to add bid?' : "Bid price cannot be empty "}
                title={input.bidPrice ? 'Confirm Bidding' : "Go back to listing."}
                type={'info'}
            />
            <button 
                type="submit" 
                onClick={ () => handleDeclarative()} 
                className="btn btn-success">
                {" "}
                Confirm Bid{" "}
            </button>        
        </div>
    )
} 

export default AddBidForm;