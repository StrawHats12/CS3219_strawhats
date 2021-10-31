const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const MESSAGING_URL = process.env.REACT_APP_MESSAGING_URL;
const LISTINGS_ENDPOINT = BACKEND_URL || "http://localhost:8080";
const ACCOUNTS_ENDPOINT = BACKEND_URL || "http://localhost:8090";
const MESSAGING_ENDPOINT = MESSAGING_URL || "http://localhost:8081";
const MESSAGING_SOCKET_ENDPOINT = MESSAGING_URL || "http://localhost:5050";
const LIVESTREAM_SOCKET_ENDPOINT = BACKEND_URL || "http://localhost:7070";
const BIDDING_ENDPOINT = `${BACKEND_URL}/bid` || "http://localhost:2001/bid";

const LISTING = {
  ID: "id",
  NAME: "listing_name",
  DESCRIPTION: "description",
  DEADLINE: "deadline",
  SELLER_ID: "seller_uid",
  SELLER_SUB: "seller_sub",
  IMAGES: "images",
};

const LIVESTREAM = {
  PLAYBACK_BASE_URL: "https://stream.mux.com/",
  CREATE_STREAM_URL: `${BACKEND_URL}/create` || "http://localhost:9000/create",
  FETCH_STREAM_PRIVATE_DETAILS_URL:
    `${BACKEND_URL}/fetchStream/` || "http://localhost:9000/fetchStream/",
  DESTORY_STREAM_BASE_URL:
    `${BACKEND_URL}/destroy/` || "http://localhost:9000/destroy/",
  STREAM_PRODUCER_ENDPOINT: "rtmp://global-live.mux.com:5222/app",
};

const MESSAGES = {
  STREAMING_INSTRUCTIONS:
    "Streaming requires a stream key and the use of streaming " +
    "software. We recommend using OBS Studio for your streaming. \n" +
    "OBS Studio is free and open source and can be downloaded here: \n" +
    "To be able to stream, follow the instructions on streaming here: https://obsproject.com/wiki/OBS-Studio-Overview" +
    `The Server URL to Stream to would be ${LIVESTREAM.STREAM_PRODUCER_ENDPOINT}` +
    " and you'd have to input your stream key into Stream Key field." +
    "Select your video and audio input sources and start streaming to stream to the world!",
};

export {
  ACCOUNTS_ENDPOINT,
  LISTING,
  LIVESTREAM,
  LISTINGS_ENDPOINT,
  MESSAGING_ENDPOINT,
  MESSAGING_SOCKET_ENDPOINT,
  LIVESTREAM_SOCKET_ENDPOINT,
  MESSAGES,
  BIDDING_ENDPOINT,
};
