import axios from "axios";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { LISTINGS_ENDPOINT } from "../const";
import { getCurrentUser } from "../hooks/useAuth";

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

const uploadListingImage = async (
  file,
  directory = undefined,
  filename = undefined
) => {
  if (!directory) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User is not logged in"); // TODO, throw proper error
    }
    directory = currentUser.attributes.sub;
  }

  if (!filename) {
    filename = uuidv4();
  }

  try {
    await Storage.put(filename, file, {
      contentType: "image/png",
      level: "protected",
    });
  } catch (error) {
    console.log("Error uploading file: ", error); // TODO, Handle Error
  }
};

export { getAllListings, getListing, uploadListingImage };
