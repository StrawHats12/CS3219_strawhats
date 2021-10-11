const express = require("express");
const { PORT } = require("./const");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Time to start Bidding!");
});

app.use("/", require("./routes/biddingRoute"))

app.listen(PORT, () => {
    console.log(`Bidding Service Listening on port ${PORT}`);
});
  