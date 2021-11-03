import axios from "axios";
import { LIVESTREAM } from "../const";
import { getCurrentSession } from "../hooks/useAuth";

// todo: add api calls here
const generateStream = async (creatorId) => {
  const payload = {
    id: creatorId.toString(),
  };

  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  const response = await axios.post(LIVESTREAM.ENDPOINT, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await response?.data;
};

const destroyStream = async (streamerId) => {
  const destroyUrl = `${LIVESTREAM.ENDPOINT}/${streamerId}`;

  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  await axios.delete(destroyUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const fetchPrivateStreamDetails = async (streamerId) => {
  const fetchUrl = `${LIVESTREAM.ENDPOINT}/private/${streamerId}`;
  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;
  const response = await axios.get(fetchUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response?.data;
};

const fetchPublicStreamDetails = async (streamerId) => {
  const fetchUrl = `${LIVESTREAM.ENDPOINT}/public/${streamerId}`;
  const response = await axios.get(fetchUrl);
  return response?.data;
};

export {
  generateStream,
  destroyStream,
  fetchPrivateStreamDetails,
  fetchPublicStreamDetails,
};
