import axios from "axios";
import { LISTINGS_ENDPOINT } from "../const";

const getAllListings = async () => {
  try {
    const response = await axios.get(LISTINGS_ENDPOINT + "/listings");
    const data = await response?.data?.Items;

    return data;
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

export { getAllListings };
