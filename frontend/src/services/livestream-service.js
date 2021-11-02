import axios from "axios";
import {LIVESTREAM} from "../const";
import {getCurrentSession} from "../hooks/useAuth";

// todo: add api calls here
const generateStream = async (creatorId) => {
  console.log("Register creator id to get stream key", creatorId);
  const payload = {
    id: creatorId.toString(),
  };

  console.log(
      `Trying to create a stream \n url ${LIVESTREAM.CREATE_STREAM_URL}`
  );
  console.log("creator id:", creatorId);

  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  let response = await axios
      .post(LIVESTREAM.CREATE_STREAM_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((e) => {
        console.error(
            "some kinda error faced when talking to the livestream backend",
            e
        );
      });
  const data = await response?.data;
  return data;
};

const destroyStream = async (streamerId) => {
  console.log("destorying stream for streamer id:", streamerId);
  const destoryUrl = LIVESTREAM.DESTORY_STREAM_BASE_URL + streamerId;

  const userSession = await getCurrentSession();
  const token = userSession?.accessToken.jwtToken;

  await axios
      .delete(destoryUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((e) => {
        console.error(
            "there was a network error when trying to destroy a stream",
            e
        );
      });
};

const fetchPrivateStreamDetails = async (streamerId) => {
  console.log("fetch Private stream details for", streamerId);
  const fetchUrl = LIVESTREAM.FETCH_STREAM_PRIVATE_DETAILS_URL + streamerId;
  let response = await axios
      .get(fetchUrl)
      .then((r) => {
        console.log(
            `backend response for fetching for streamer id ${streamerId}: `,
            r
        );
        return r;
      })
      .catch((e) => {
        console.error("some error trying to fetch private stream details:", e);
      });
  console.log("fetched these details from backend:", response);
  return response?.data;
};

const fetchPublicStreamDetails = async (streamerId) => {
  console.log("fetch public stream details for", streamerId);
  const fetchUrl = LIVESTREAM.FETCH_STREAM_PUBLIC_DETAILS_URL + streamerId;
  let response = await axios
      .get(fetchUrl)
      .then((r) => {
        console.log("PUBLIC DATA: ", r.data)
        return r;
      })
      .catch((e) => {
        console.error("some error trying to fetch public stream details:", e);
      });
  console.log("fetched these details from backend:", response);
  return response?.data;
};



export {generateStream, destroyStream, fetchPrivateStreamDetails, fetchPublicStreamDetails};
