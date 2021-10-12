import axios from "axios";
import { ACCOUNTS_ENDPOINT } from "../const";
import { getCurrentSession } from "../hooks/useAuth";

const getAccount = async (username) => {
  try {
    const response = await axios.get(
      `${ACCOUNTS_ENDPOINT}/account/${username}`
    );
    const data = await response?.data?.Item;

    return data;
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

const updateAccount = async (account) => {
  try {
    const userSession = await getCurrentSession();
    const token = userSession?.accessToken.jwtToken;

    await axios.put(
      `${ACCOUNTS_ENDPOINT}/account/${account.username}`,
      account,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log(error); // TODO, handle this error
    return null;
  }
};

export { getAccount, updateAccount };
