const Bid = require("../model/bid")
const {
    addBidding,
    getListingBids,
    deleteBid
} = require("../bidDynamoDb");

exports.addBid = async function (req, res) {
    console.log(req.body);
    const newBid = new Bid(req.body);
    try {
        const addNewBidding = await addBidding(newBid);
        console.log(addNewBidding);
        res.json(newBid);
    } catch (err) {
        console.error(err);
        res.status(500).json({err: "New bid cannot be added."});
    }
}

exports.getListingBids = async function (req, res) {
    const listingId = req.params.listingId;
    try {
        const listBids = await getListingBids(listingId);
        console.log(listBids);
        res.json(listBids);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Cannot retrieve listing's bid."});
    }
}

exports.deleteBid = async function (req, res) {
    const bidId = req.params.bidId
    try {
        res.json(await deleteBid(bidId));
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Delete bid is not working." });
    }
}