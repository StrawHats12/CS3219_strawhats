import axios from "axios";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { LISTINGS_ENDPOINT } from "../const";

const getAllListings = async () => {
  try {
    const response = await axios.get(`${LISTINGS_ENDPOINT}/listings`);
    const data = await response?.data?.Items;

    return data;
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const getListing = async (id) => {
  try {
    const response = await axios.get(`${LISTINGS_ENDPOINT}/listing/${id}`);
    const data = await response?.data?.Item;

    return data;
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const createListing = async (listing) => {
  try {
    await axios.post(`${LISTINGS_ENDPOINT}/listing`, listing);
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const uploadListingImage = async (file) => {
  const filename = uuidv4();

  try {
    await Storage.put(filename, file, {
      contentType: "image/png",
      level: "protected",
    });

    return filename;
  } catch (error) {
    console.log("Error uploading file: ", error); // TODO, Handle Error
  }
};

export { createListing, getAllListings, getListing, uploadListingImage };
