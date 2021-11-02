require("dotenv").config();

const AWS_REGION = "ap-southeast-1";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const CONVERSATIONS_TABLE_NAME = "strawhats_conversations";
const MESSAGES_TABLE_NAME = "strawhats_messages";

const PORT = process.env.PORT || 8081;
const REDIS_HOST = process.env.REDIS_HOST || "localhost";

module.exports = {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  CONVERSATIONS_TABLE_NAME,
  MESSAGES_TABLE_NAME,
  PORT,
  SOCKET_PORT,
  REDIS_HOST,
};
