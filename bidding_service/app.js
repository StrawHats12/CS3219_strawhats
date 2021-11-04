const express = require("express");
const { PORT } = require("./const");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

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
