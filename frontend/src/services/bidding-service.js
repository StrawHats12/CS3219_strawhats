import React, {useState} from "react";
import axios from "axios";
import { getCurrentSession, getCurrentUser } from "../hooks/useAuth";
import {DateTimePickerComponent} from '@syncfusion/ej2-react-calendars';
import { stringToDate } from "../utils/DateTime";


const getListingBids = async (listingId) => {
    try {
        const userSession = await getCurrentSession();
        const token = userSession?.accessToken.jwtToken;
        const response = await axios.get(`http://localhost:2001/getListingBids/${listingId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
        }});
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

const deleteBid = async (bidId) => {
    try {
        const userSession = await getCurrentSession();
        const token = userSession?.accessToken.jwtToken;
        await axios.delete(`http://localhost:2001/deleteBid/${bidId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
    } catch (error) {
        console.log(error); // TODO, handle this error
        return null;
    }
}

const AddBid = ({listingInfo, toggleModal}) => {
    
    const currentdate = new Date(); 
    const datetime = "Last Sync: " + currentdate.getDate() + "/"
                    + (currentdate.getMonth()+1)  + "/" 
                    + currentdate.getFullYear() + " @ "  
                    + currentdate.getHours() + ":"  
                    + currentdate.getMinutes() + ":" 
                    + currentdate.getSeconds();

    const [input, setInput] = useState({
        bidPrice: "",
        bidDeadline: datetime
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
                bidDeadline: input.bidDeadline,
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

    return (
    <div className = "container">
        <h1> Place Your Bid </h1>
        <br/> <br/>
        <form onSubmit={handleClick}>
            <div className = "form-group">
                <label> Bid Price: </label>
                <input name = "bidPrice" 
                    onChange = {handleChange} 
                    autoComplete = "off" 
                    value = {input.bidPrice} 
                    className = "form-control" 
                    placeholder = "Enter Your Price Here"
                    required/>
            </div>
            <br/>
            <label> Bid End Date: </label>
            <DateTimePickerComponent placeholder="Choose a date and time to end your bid." 
                value = {input.bidDeadline}
                min ={stringToDate(listingInfo.createdAt)}
                max ={stringToDate(listingInfo.deadline)} 
                required/>
            <br/> <br/> 
            <button type="submit" class="btn btn-success"> Confirm Bid </button>
        </form>
        <br/>
        <button onClick={toggleModal} class="btn btn-dark"> Close </button>
    </div>)
}

export {AddBid, getListingBids, deleteBid, GetAccountBids};