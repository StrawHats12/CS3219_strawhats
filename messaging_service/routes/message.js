const router = require("express").Router();
const Message = require("../models/message");

const {
  getMessages,
  getMessagesByConvoId,
  addMessage,
} = require("../dynamoDb/message");

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await getMessages();
    // console.log(messages);
    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get messages of a conversation
router.get("/:convoId", async (req, res) => {
  const convoId = req.params.convoId;
  try {
    const msgs = await getMessagesByConvoId(convoId);
    // console.log(msgs);
    res.status(200).json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create message
router.post("/", async (req, res) => {
  const body = req.body;
  const msg = new Message(body);

  try {
    const savedMsg = await addMessage(msg);
    res.status(200).json(savedMsg);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
