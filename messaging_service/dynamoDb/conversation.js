const AWS = require("aws-sdk");
const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  CONVERSATIONS_TABLE_NAME,
} = require("../const");

AWS.config.update({
  region: AWS_REGION,
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const dynamoClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = CONVERSATIONS_TABLE_NAME;

const getConversations = async () => {
  const params = {
    TableName: TABLE_NAME,
  };
  return await dynamoClient.scan(params).promise();
};

const getConversationByUserId = async (id) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: "contains(#members, :id)",
    ExpressionAttributeNames: {
      "#members": "members",
    },
    ExpressionAttributeValues: {
      ":id": id,
    },
  };

  return await dynamoClient.scan(params).promise();
};

const addConversation = async (c) => {
  const params = {
    TableName: TABLE_NAME,
    Item: c,
  };
  await dynamoClient.put(params).promise();
  return c;
};

module.exports = {
  dynamoClient,
  getConversations,
  getConversationByUserId,
  addConversation,
};
