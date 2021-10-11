const Bid = require("../model/bid")
const {
    addBidding
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