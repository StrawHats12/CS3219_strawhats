require("dotenv").config();

const express = require("express");
const cors = require("cors");

const io = require("socket.io")(process.env.SOCKET_PORT);
const redis = require("socket.io-redis");

const PORT = process.env.PORT;
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const { auth, roles } = require("./auth");

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/conversation", auth(roles.USER), conversationRoute);
app.use("/message", auth(roles.USER), messageRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// For redis elasticache in the future
// io.adapter(
//   redis({
//     host: "localhost",
//     port: 6379,
//   })
// );

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("Connection with: " + id);
  socket.join(id);

  socket.on("send-message", ({ conversation_id, recipients, text }) => {
    recipients.forEach((recipient) => {
      // Remove current recipient from list of recipients
      const newRecipients = recipients.filter((r) => r !== recipient);
      newRecipients.push(id);
      socket.broadcast.to(recipient).emit("receive-message", {
        recipients: newRecipients,
        sender: id,
        text,
        conversation_id,
      });
    });
  });
});
