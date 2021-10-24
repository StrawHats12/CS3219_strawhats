const LISTINGS_ENDPOINT = "http://localhost:8080";
const ACCOUNTS_ENDPOINT = "http://localhost:8090";
const MESSAGING_ENDPOINT = "http://localhost:8081";
const MESSAGING_SOCKET_ENDPOINT = "http://localhost:5000";

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
  CREATE_STREAM_URL: "http://localhost:9000/create",
  FETCH_STREAM_PRIVATE_DETAILS_URL: "http://localhost:9000/fetchStream/",
  DESTORY_STREAM_BASE_URL: "http://localhost:9000/destroy/"
}

export {
  ACCOUNTS_ENDPOINT,
  LISTING,
  LIVESTREAM,
  LISTINGS_ENDPOINT,
  MESSAGING_ENDPOINT,
  MESSAGING_SOCKET_ENDPOINT,
};
