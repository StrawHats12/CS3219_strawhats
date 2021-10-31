const Bid = require("../model/bid")
const {
    addBidding,
    getListingBids,
    deleteBid,
    getAccountBids,
    getWinningBid
} = require("../bidDynamoDb");

exports.addBid = async function (req, res) {
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

exports.getWinningBid = async function (req, res) {
    const listingId = req.params.listingId;
    try {
        const winningBid = await getWinningBid(listingId);
        console.log(winningBid);
        res.json(winningBid);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Cannot retrieve listing's bid."});
    }
}

exports.getListingBids = async function (req, res) {
    const listingId = req.params.listingId;
    try {
        const listBids = await getListingBids(listingId);
        res.json(listBids);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Cannot retrieve listing's bid."});
    }
}

exports.deleteBid = async function (req, res) {
    const bidId = req.params.bidId
    const bidPrice = req.params.bidPrice
    try {
        res.json(await deleteBid(bidId, bidPrice));
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Delete bid is not working." });
    }
}

exports.getAccountBids = async function (req, res) {
    const uname = req.params.uname
    try {
        const accountBids = await getAccountBids(uname);
        console.log(accountBids);
        res.json(accountBids);
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Cannot retrieve account's bid."});
    }
}