const DEPLOYED = !!process.env.REACT_APP_DEPLOYED;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MESSAGING_URL = BACKEND_URL && `${BACKEND_URL}/messaging`;
const LIVESTREAM_URL = BACKEND_URL && `${BACKEND_URL}/livestream`;

const LISTINGS_ENDPOINT = DEPLOYED ? BACKEND_URL : "http://localhost:8080";
const ACCOUNTS_ENDPOINT = DEPLOYED ? BACKEND_URL : "http://localhost:8090";
const MESSAGING_ENDPOINT = DEPLOYED ? MESSAGING_URL : "http://localhost:8081";
const MESSAGING_SOCKET_ENDPOINT = DEPLOYED
  ? BACKEND_URL
  : "http://localhost:8081";
const BIDDING_SOCKET_ENDPOINT = DEPLOYED
  ? `${BACKEND_URL}`
  : "http://localhost:2001";
const LIVESTREAM_SOCKET_ENDPOINT = BACKEND_URL || "http://localhost:9000";
const BIDDING_ENDPOINT = DEPLOYED
  ? `${BACKEND_URL}/bid`
  : "http://localhost:2001/bid";

const LISTING = {
  ID: "id",
  NAME: "listing_name",
  DESCRIPTION: "description",
  DEADLINE: "deadline",
  SELLER_ID: "seller_uid",
  SELLER_SUB: "seller_sub",
  SELLER_USERNAME: "seller_username",
  IMAGES: "images",
};

const LIVESTREAM = {
  PLAYBACK_BASE_URL: "https://stream.mux.com/",
  ENDPOINT: LIVESTREAM_URL || "http://localhost:9000/livestream",
  STREAM_PRODUCER_ENDPOINT: "rtmp://global-live.mux.com:5222/app",
};

export {
  DEPLOYED,
  ACCOUNTS_ENDPOINT,
  LISTING,
  LIVESTREAM,
  LISTINGS_ENDPOINT,
  MESSAGING_ENDPOINT,
  MESSAGING_SOCKET_ENDPOINT,
  LIVESTREAM_SOCKET_ENDPOINT,
  BIDDING_ENDPOINT,
  BIDDING_SOCKET_ENDPOINT,
};
