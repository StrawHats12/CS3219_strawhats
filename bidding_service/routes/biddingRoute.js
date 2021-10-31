let router = require('express').Router();
const { auth, roles } = require("../auth");

var bidController = require('../controller/bidController');

router.route('/bid/addBid')
    .post(auth(roles.USER), bidController.addBid);

router.route('/bid/getListingBids/:listingId')
    .get(bidController.getListingBids);

router.route('/bid/deleteBid/:bidId/:bidPrice')
    .delete(auth(roles.USER), bidController.deleteBid);

router.route('/bid/getAccountBids/:uname')
    .get(bidController.getAccountBids);

module.exports = router;