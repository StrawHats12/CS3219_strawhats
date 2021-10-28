const router = require("express").Router();
const Conversation = require("../models/conversation");

const {
  getConversations,
  getConversationByUserId,
  addConversation,
} = require("../dynamoDb/conversation");

// Get all conversations
router.get("/", async (req, res) => {
  try {
    const conversations = await getConversations();
    // console.log(conversations);
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get conversations of a user
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const conversations = await getConversationByUserId(userId);
    // console.log(conversations);
    res.status(200).json(conversations);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create conversation
router.post("/", async (req, res) => {
  const body = req.body;
  const convo = new Conversation(body);

  try {
    const savedConvo = await addConversation(convo);
    // console.log(savedConvo);
    res.status(200).json(savedConvo);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
