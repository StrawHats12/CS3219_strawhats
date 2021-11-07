const AWS_REGION = "ap-southeast-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const LIVESTREAM_TABLE_NAME = "strawhats_livestream";
const REDIS_HOST = process.env.REDIS_HOST || "localhost";

module.exports = {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  LIVESTREAM_TABLE_NAME,
  REDIS_HOST,
};
