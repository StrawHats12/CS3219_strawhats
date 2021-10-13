let router = require('express').Router();
const { auth, roles } = require("../auth");

// Import contact controller
var bidController = require('../controller/bidController');

router.route('/addBid')
    .post(auth(roles.USER), bidController.addBid);

router.route('/getListingBids/:listingId')
    .get(auth(roles.USER), bidController.getListingBids);

router.route('/deleteBid/:bidId')
    .delete(auth(roles.USER), bidController.deleteBid);

module.exports = router;