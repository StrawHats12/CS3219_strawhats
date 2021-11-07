const express = require("express");
const { PORT, REDIS_HOST } = require("./const");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

const server = app.listen(PORT, () => {
  console.log(`Bidding Service Listening on port ${PORT}`);
});

const io = require("socket.io")(server, {
  path: "/bid/socket.io",
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

const pubClient = createClient({ host: REDIS_HOST, port: 6379 });
const subClient = pubClient.duplicate();
io.adapter(createAdapter(pubClient, subClient));

app.set("socketio", io);

app.get("/", (req, res) => {
  res.send("Server up. Time to start Bidding!");
});

app.use("/bid", require("./routes/biddingRoute"));

io.on("connection", (socket) => {
  const listingId = socket.handshake.query.listingId;
  console.log("Connection with: " + listingId);
  socket.join(listingId);

  socket.on("add-bid", (newBid) => {
    console.log(newBid);
    socket.broadcast.to(listingId).emit("receive-new-bid", newBid);
  });
});
