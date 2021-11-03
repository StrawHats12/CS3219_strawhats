const express = require("express");
const { PORT, SOCKET_PORT } = require("./const");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

var server = app.listen(PORT, () => {
  console.log(`Bidding Service Listening on port ${PORT}`);
});

var io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    // credentials: true
  },
});

app.set("socketio", io);

app.get("/", (req, res) => {
  res.send("Server up. Time to start Bidding!");
});

app.use("/bid", require("./routes/biddingRoute"));

// listen to listing id
// whenever someone add bid successful
// -> everyone who is listening to the socket will receive the new bid

io.on("connection", (socket) => {
  const listingId = socket.handshake.query.listingId;
  console.log("Connection with: " + listingId);
  socket.join(listingId);

  socket.on("add-bid", (newBid) => {
    console.log(newBid);
    socket.broadcast.to(listingId).emit("receive-new-bid", newBid);
  });
});
