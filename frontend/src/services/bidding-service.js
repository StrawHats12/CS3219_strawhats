import React, {useState} from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../hooks/useAuth";

const GetListingBids = async () => {
    try {
        const response = await axios.get('http://localhost:2001/getListingBids');
        const data = await response?.data?.Items;
        return data;
      } catch (error) {
        console.log(error); // TODO, handle this error
        return null;
      }
}

const GetAccountBids = async () => {
    try {
        const response = await axios.get('http://localhost:2001/getAccountBids');
        const data = await response?.data?.Items;
    
        return data;
      } catch (error) {
        console.log(error); // TODO, handle this error
        return null;
      }
}

const AddBid = ({listingInfo}) => {

    const [input, setInput] = useState({
        bidPrice: "",
        endBidDateTime: ""
    })

    function handleChange(event) {
        const {name, value} = event.target;

        setInput(prevInput => {
            return {
                ...prevInput,
                [name]: value
            }
        });
    }

    async function handleClick(event) {
        event.preventDefault();
        try {
            const userSession = await getCurrentSession();
            const currentUser = await getCurrentUser();
            const token = userSession?.accessToken.jwtToken;
            const newBid = {
                listingId: listingInfo.id,
                userIdentifier: currentUser.username,
                bidPrice: input.bidPrice,
                auctionId: listingInfo.bidding_id,
                status: "ONGOING"
            }
            await axios.post('http://localhost:2001/addBid', newBid, {
                headers: {
                    Authorization: `Bearer ${token}`,
            }});
        } catch (err) {
            console.log(err);
            return null;
        }

    }

    return <div className = "container">
        <h1> Place Your Bid </h1>
        <br/>
        <form>
            <div className = 'form-group'>
                <input name="bidPrice" onChange={handleChange}  autoComplete="off" value={input.bidPrice} 
                className = "form-control" placeholder="Enter Your Price Here"/>
            </div>
            <br/>
            {/* <div className = 'form-group'>
                <input name="endBidDateTime" onChange={handleChange} className = "form-control" value={input.endBidDateTime} 
                autoComplete="off" placeholder="Your bid will expiry after this time"/>
            </div> */}
            <br/>
            <button onClick={handleClick} className="btn btn-lg btn-info"> Confirm Bid </button>
        </form>
    </div>
}



export {AddBid, GetListingBids, GetAccountBids};