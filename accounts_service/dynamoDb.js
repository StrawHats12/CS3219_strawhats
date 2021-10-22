const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  ACCOUNTS_TABLE_NAME,
} = require("./const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = ACCOUNTS_TABLE_NAME;

const getAccountById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "uid-index",
    ExpressionAttributeValues: {
      ":id": id,
    },
    ExpressionAttributeNames: {
      "#uid": "uid",
    },
    KeyConditionExpression: "#uid = :id",
  };
  return await dynamoClient.query(params).promise();
};

const getAccountByUsername = async (username) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      username,
    },
  };
  return await dynamoClient.get(params).promise();
};

const addOrUpdateAccount = async (account) => {
  const params = {
    TableName: TABLE_NAME,
    Item: account,
  };
  await dynamoClient.put(params).promise();
  return account;
};

const deleteAccount = async (username) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      username,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  getAccountById,
  getAccountByUsername,
  addOrUpdateAccount,
  deleteAccount,
};
