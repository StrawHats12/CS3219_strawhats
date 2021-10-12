const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  MESSAGES_TABLE_NAME,
} = require("../const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = MESSAGES_TABLE_NAME;

const getMessages = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.scan(params).promise();
};

// TODO: Change to secondary index and sort
const getMessagesByConvoId = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "#conversation_id = :id",
    ExpressionAttributeValues: {
      ":id": id,
    },
    ExpressionAttributeNames: {
      "#conversation_id": "conversation_id",
    },
    KeyConditionExpression: "#conversation_id = :id",
  };
  return await dynamoClient.scan(params).promise();
};

const addMessage = async (m) => {
  const params = {
    TableName: TABLE_NAME,
    Item: m,
  };
  const savedMsg = await dynamoClient.put(params).promise();
  return savedMsg;
};

module.exports = {
  dynamoClient,
  getMessages,
  getMessagesByConvoId,
  addMessage,
};
