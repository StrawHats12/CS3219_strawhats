require("dotenv").config();

const AWS_REGION = "us-east-2";
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

const CONVERSATIONS_TABLE_NAME = "strawhats_conversations";
const MESSAGES_TABLE_NAME = "strawhats_messages";

const PORT = 8081;

module.exports = {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  CONVERSATIONS_TABLE_NAME,
  MESSAGES_TABLE_NAME,
  PORT,
};
