const Listing = require("./listing");
const express = require("express");
const { PORT } = require("./const");
const {
  getListingById,
  getListingsBySellerId,
  addOrUpdateListing,
  deleteListing,
} = require("./dynamoDb");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.get("/listing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listing = await getListingById(id);
    console.log(listing);
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.get("/listings/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const listings = await getListingsBySellerId(id);
    console.log(listings);
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.post("/listing", async (req, res) => {
  const body = req.body;
  const listing = new Listing(body);

  try {
    const newListing = await addOrUpdateListing(listing);
    console.log(newListing);
    res.json(newListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put('/listing/:id', async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  body.id = id;
  const listing = new Listing(body);

  try {
    const newListing = await addOrUpdateListing(listing);
    console.log(newListing);
    res.json(newListing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.delete("/listing/:id", async (req, res) => {
  const id = req.params.id;
  try {
    res.json(await deleteListing(id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
