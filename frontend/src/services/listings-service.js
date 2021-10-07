import axios from "axios";
import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { LISTINGS_ENDPOINT } from "../const";
import { getCurrentSession } from "../hooks/useAuth";

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
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;

    await axios.post(`${LISTINGS_ENDPOINT}/listing`, listing, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const updateListing = async (listing) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;

    await axios.put(`${LISTINGS_ENDPOINT}/listing/${listing.id}`, listing, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const deleteListing = async (id) => {
  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  await axios.delete(`${LISTINGS_ENDPOINT}/listing/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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

const deleteListingImages = async (images, seller_uid) => {
  for (let i = 0; i < images.length; i++) {
    await Storage.remove(images[i], {
      level: "protected",
      identityId: seller_uid,
    });
  }
};

const generateListingId = () => {
  return uuidv4();
};

export {
  createListing,
  deleteListing,
  deleteListingImages,
  getAllListings,
  getListing,
  generateListingId,
  uploadListingImage,
  updateListing,
};
