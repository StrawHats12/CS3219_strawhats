let router = require('express').Router();
const { auth, roles } = require("../auth");

// Import contact controller
var bidController = require('../controller/bidController');

// Set default API response
// router.get('/', function (req, res) {
//     res.json({
//         status: 'Bidding API',
//         message: 'Bidding API to let you bid for your favorite items!',
//     });
// });


router.route('/addBid')
    .post(auth(roles.USER), bidController.addBid);

router.route('/getListingBids/:listingId')
    .get(auth(roles.USER), bidController.getListingBids);

module.exports = router;