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

export {
  ACCOUNTS_ENDPOINT,
  LISTING,
  LISTINGS_ENDPOINT,
  MESSAGING_ENDPOINT,
  MESSAGING_SOCKET_ENDPOINT,
};
