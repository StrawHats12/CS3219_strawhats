const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  LIVESTREAM_TABLE_NAME,
} = require("./const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = LIVESTREAM_TABLE_NAME;

const getKeysByStreamerId = async (streamer_id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      streamer_id,
    },
  };
  return await dynamoClient.get(params).promise();
};

const getItemByStreamId = async (live_stream_id) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: "live_stream_id-index",
    ExpressionAttributeValues: {
      ":live_stream_id": live_stream_id,
    },
    ExpressionAttributeNames: {
      "#live_stream_id": "live_stream_id",
    },
    KeyConditionExpression: "#live_stream_id = :live_stream_id",
  };
  return await dynamoClient.query(params).promise();
};

/**
 * Item line = {
 *   uid = xxx,
 * }
 * @param item
 * @returns {Promise<*>}
 */
const addOrUpdateKeys = async (item) => {
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };
  await dynamoClient.put(params).promise(); // returns empty obj
  return item; // return
};

const deleteKeys = async (streamer_id) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      streamer_id: streamer_id,
    },
  };
  return await dynamoClient.delete(params).promise();
};

module.exports = {
  getKeysByStreamerId,
  addOrUpdateKeys,
  deleteKeys,
  getItemByStreamId,
};
