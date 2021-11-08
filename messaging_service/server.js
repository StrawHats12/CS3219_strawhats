const express = require("express");
const cors = require("cors");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");
const conversationRoute = require("./routes/conversation");
const messageRoute = require("./routes/message");
const { auth, roles } = require("./auth");
const { PORT, REDIS_HOST } = require("./const");

const app = express();

app.use(express.json());
app.use(cors());

var server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const pubClient = createClient({ host: REDIS_HOST, port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

app.set("socketio", io);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.use("/conversation", auth(roles.USER), conversationRoute);
app.use("/message", auth(roles.USER), messageRoute);

io.on("connection", (socket) => {
  const id = socket.handshake.query.id;
  console.log("Connection with: " + id);
  socket.join(id);

  socket.on(
    "send-message",
    ({ conversation_id, recipients, text, sender_id }) => {
      socket.broadcast.to(conversation_id).emit("receive-message", {
        recipients,
        sender_id,
        text,
        conversation_id,
      });
    }
  );
});
