const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  LISTINGS_TABLE_NAME,
} = require("./const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = LISTINGS_TABLE_NAME;

const getListingsBySellerId = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "seller_uid-index",
    ExpressionAttributeValues: {
      ":id": id,
    },
    ExpressionAttributeNames: {
      "#seller_uid": "seller_uid",
    },
    KeyConditionExpression: "#seller_uid = :id",
  };
  return await dynamoClient.query(params).promise();
};

const getListingById = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.get(params).promise();
};

const addOrUpdateListing = async (listing) => {
  const params = {
    TableName: TABLE_NAME,
    Item: listing,
  };
  await dynamoClient.put(params).promise();
  return listing;
};

const deleteListing = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  dynamoClient,
  getListingById,
  getListingsBySellerId,
  addOrUpdateListing,
  deleteListing,
};
