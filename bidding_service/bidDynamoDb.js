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
        Item: bid
    }
    await dynamoClient.put(params).promise();
    return bid;
}

// GET BID BY LISTING ID
const getListingBids = async (listingId) => {
    const params = {
        TableName: BIDDINGS_TABLE_NAME,
        FilterExpression: 'contains(#listingId, :listingId)',
        ExpressionAttributeNames: {
            '#listingId' : 'listingId'
        },
        ExpressionAttributeValues: {
            ':listingId' : listingId
        }
    }
    return dynamoClient.scan(params).promise();
}

// DELETE BID BY BIDDING ID
const deleteBid = async (bidId) => {
    const params = {
        TableName: BIDDINGS_TABLE_NAME,
        Key: {
            bidId,
        }
    };
    return await dynamoClient.delete(params).promise();
}

module.exports = {
    dynamoClient,
    addBidding,
    getListingBids,
    deleteBid
};
