import React, {useState} from "react";
import axios from "axios";

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

const AddBid = ({listingInfo, bidOwner}) => {

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

    function handleClick(event) {
        event.preventDefault();
        const newBid = {
            userIdentifier: bidOwner,
            bidPrice: input.bidPrice,
            listingId: listingInfo.id,
            endBidDateTime: input.endBidDateTime,
            status: "ONGOING"
        }
        axios.put('http://localhost:2001/createBid', newBid);
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
            <div className = 'form-group'>
                <input name="endBidDateTime" onChange={handleChange} className = "form-control" value={input.endBidDateTime} 
                autoComplete="off" placeholder="Your bid will expiry after this time"/>
            </div>
            <br/>
            <button onClick={handleClick} className="btn btn-lg btn-info"> Confirm Bid </button>
        </form>
    </div>
}



export {AddBid, GetListingBids, GetAccountBids};