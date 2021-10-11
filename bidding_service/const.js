require("dotenv").config();

const AWS_REGION = "ap-southeast-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const BIDDINGS_TABLE_NAME = "strawhats_bidding";

const PORT = 2001;

module.exports = {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BIDDINGS_TABLE_NAME,
  PORT
};
