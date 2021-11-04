const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  BIDDINGS_TABLE_NAME,
} = require("./const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();

// ADD BID
const addBidding = async (bid) => {
  const params = {
    TableName: BIDDINGS_TABLE_NAME,
    Item: bid,
  };
  await dynamoClient.put(params).promise();
  return bid;
};

// GET WINNING BID BY LISTING ID
const getWinningBid = async (listingId) => {
  const params = {
    TableName: BIDDINGS_TABLE_NAME,
    KeyConditionExpression: "#listingId = :listingId",
    ExpressionAttributeNames: {
      "#listingId": "listingId",
    },
    ExpressionAttributeValues: {
      ":listingId": listingId,
    },
    Limit: 1,
    ScanIndexForward: false,
  };
  return dynamoClient.query(params).promise();
};

// GET BID BY LISTING ID
const getListingBids = async (listingId) => {
  const params = {
    TableName: BIDDINGS_TABLE_NAME,
    KeyConditionExpression: "#listingId = :listingId",
    ExpressionAttributeNames: {
      "#listingId": "listingId",
    },
    ExpressionAttributeValues: {
      ":listingId": listingId,
    },
    ScanIndexForward: false,
  };
  return dynamoClient.query(params).promise();
};

// GET BIDS BY BIDDING USERNAME
const getAccountBids = async (uname) => {
  const params = {
    TableName: BIDDINGS_TABLE_NAME,
    FilterExpression: "contains(#bidOwner, :bidOwner)",
    ExpressionAttributeNames: {
      "#bidOwner": "bidOwner",
    },
    ExpressionAttributeValues: {
      ":bidOwner": uname,
    },
  };
  return dynamoClient.scan(params).promise();
};

// UPDATE WINNER BID
const updateWinnerBid = async (listingId, bidPrice) => {
  const params = {
    TableName: BIDDINGS_TABLE_NAME,
    Key: {
      listingId: listingId,
      bidPrice: bidPrice,
    },
    UpdateExpression: "set #status = :status",
    ExpressionAttributeNames: {
      "#status": "status",
    },
    ExpressionAttributeValues: {
      ":status": "WINNER",
    },
  };
  return dynamoClient.update(params).promise();
};

module.exports = {
  dynamoClient,
  addBidding,
  getListingBids,
  getAccountBids,
  getWinningBid,
  updateWinnerBid,
};
