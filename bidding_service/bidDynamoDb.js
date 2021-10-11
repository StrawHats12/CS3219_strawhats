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

const addBidding = async (bid) => {
    const params = {
        TableName: BIDDINGS_TABLE_NAME,
        Item: bid
    }
    await dynamoClient.put(params).promise();
    return bid;
}

module.exports = {
    dynamoClient,
    addBidding
};
