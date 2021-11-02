const express = require("express");
const { PORT, SOCKET_PORT } = require("./const");

const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const bidIo = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE", "PUT"],
    },
});

app.get("/", (req, res) => {
    res.send("Time to start Bidding!");
});

app.use("/bid", require("./routes/biddingRoute"))

app.listen(PORT, () => {
    console.log(`Bidding Service Listening on port ${PORT}`);
});
// listen to listing id
// whenever someone add bid successful 
// -> everyone who is listening to the socket will receive the new bid

bidIo.on('connection', (socket) => {
    const listingId = socket.handshake.query.id;
    console.log("Connection with: " + id);
    socket.join(id);

    socket.on('bid-added', function(){
		console.log('user disconnected');
	});
})

server.listen(SOCKET_PORT, () => {
    console.log("Bidding socket running!");
});
  
  