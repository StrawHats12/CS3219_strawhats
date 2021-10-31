require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

// const redis = require("socket.io-redis");

const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const { auth, roles } = require("./auth");
const { PORT, SOCKET_PORT } = require("./const");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

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

server.listen(SOCKET_PORT, () => {
  console.log("Messaging socket running!");
});
