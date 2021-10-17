import axios from "axios";
import { ACCOUNTS_ENDPOINT } from "../const";
import { getCurrentSession } from "../hooks/useAuth";

const getAccount = async (username) => {
  const response = await axios.get(`${ACCOUNTS_ENDPOINT}/account/${username}`);
  const data = await response?.data?.Item;

  if (!data) {
    throw new Error("Account not found");
  }

  return data;
};

const updateAccount = async (account) => {
  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  await axios.put(`${ACCOUNTS_ENDPOINT}/account/${account.username}`, account, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export { getAccount, updateAccount };
