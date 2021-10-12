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

const getListingBids = (listingId) => {
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

    dynamoClient.scan(params, (err, bids) => {
        if (err) console.log(err);
        else {
            console.log(bids);
            return bids;
        }
    });
    // dynamoClient.query(params, (err, bids) => {
    //     if (err) console.log(err);
    //     else {
    //         console.log(bids);
    //         return bids;
    //     }
    // });
}

module.exports = {
    dynamoClient,
    addBidding,
    getListingBids
};
