require("dotenv").config();

const AWS_REGION = "ap-southeast-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const BIDDINGS_TABLE_NAME = "strawhats_biddings";

const PORT = 2001;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";

module.exports = {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BIDDINGS_TABLE_NAME,
  PORT,
  REDIS_HOST,
};
