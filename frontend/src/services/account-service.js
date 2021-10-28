import axios from "axios";
import Storage from "@aws-amplify/storage";
import { ACCOUNTS_ENDPOINT } from "../const";
import {
  getCurrentSession,
  getCurrentUser,
  getCurrentUserCredentials,
} from "../hooks/useAuth";
import { v4 as uuidv4 } from "uuid";

const getAccount = async (username) => {
  const response = await axios.get(`${ACCOUNTS_ENDPOINT}/account/${username}`);
  const data = await response?.data?.Item;

  if (!data) {
    throw new Error("Account not found");
  }

  return data;
};

const getAccountById = async (id) => {
  const response = await axios.get(`${ACCOUNTS_ENDPOINT}/account/id/${id}`);
  const data = await response?.data?.Items;

  if (!data || data.length === 0) {
    throw new Error("Account not found");
  }

  return data[0];
};

const updateAccount = async (account, image) => {
  const userSession = await getCurrentSession();
  const userCredentials = await getCurrentUserCredentials();
  const token = userSession?.accessToken.jwtToken;

  if (image) {
    const seller_uid = userCredentials?.identityId;
    account.uid = seller_uid;
    await deleteAccountImage(account.image, seller_uid);
    account.image = uuidv4();
    await uploadAccountImage(image, account.image);
  }

  await axios.put(`${ACCOUNTS_ENDPOINT}/account/${account.username}`, account, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const uploadAccountImage = async (file, imageName) => {
  await Storage.put(imageName, file, {
    contentType: file.type,
    level: "protected",
  });
};

const deleteAccountImage = async (image, uid) => {
  if (!image) {
    return;
  }

  await Storage.remove(image, {
    level: "protected",
    identityId: uid,
  });
};

const addReview = async (review, username) => {
  const userSession = await getCurrentSession();
  const userCredentials = await getCurrentUser();
  review.username = userCredentials.username;
  const token = userSession?.accessToken.jwtToken;

  await axios.patch(`${ACCOUNTS_ENDPOINT}/account/${username}`, review, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { addReview, getAccount, updateAccount, getAccountById };
