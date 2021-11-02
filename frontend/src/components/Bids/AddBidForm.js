import React, { useState } from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../../hooks/useAuth";
import { BIDDING_ENDPOINT } from "../../const";
import Alert from './Alert';
import { getWinningBid } from "../../services/bidding-service";
import StrawhatSpinner from "../StrawhatSpinner";

const AddBidForm = ({listingInfo}) => {
    
    const [input, setInput] = useState({
        bidPrice: "",
    });
    const [winningBid, setWinningBid] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeclarative, setShowDeclarative] = useState(false);
    const [showStringDeclarative, setShowStringDeclarative] = useState(false);

    const handleDeclarative = () => {
        setShowDeclarative(!showDeclarative);
    }
    
    const handleStringDeclarative = () => {
      setShowStringDeclarative(!showStringDeclarative);
  }

    const placerFunction = () => {return;}

    useEffect( () => {
      getWinningBid(listingInfo.id).then((res) => {
            if (!res) {
                setWinningBid(false);
                return;
            }
            winningBid(res);
            setIsLoading(false);
      })
    }, []);

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
          window.location.reload(false);
        } catch (err) {
          console.log(err);
          return null;
        }
      }

    return (
      <>
        {
          <div>
              <h5> Bid Price: </h5>
              { 
                isLoading
                ? <StrawhatSpinner/> 
                : <input
                    name="bidPrice"
                    type="number"
                    onChange={handleChange}
                    autoComplete="off"
                    value={input.bidPrice}
                    className="form-control"
                    placeholder="Enter Your Price Here"
                    min={winningBid[0] ? winningBid[0].bidPrice : 0}
                    required
                  />
              }
              <br/>
              <Alert
                  onConfirmOrDismiss={() => handleDeclarative()}
                  show={showDeclarative}
                  showCancelButton={true}
                  onConfirm={input.bidPrice ? () => handleClick() : () => placerFunction()}
                  text={input.bidPrice ?  'Do you really want to add bid?' : "Bid price cannot be empty "}
                  title={input.bidPrice ? "Confirm Bidding.": "Go back to listing."}
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
        }
      </>
    )
} 

export default AddBidForm;