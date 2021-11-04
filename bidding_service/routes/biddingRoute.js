const router = require("express").Router();
const { auth, roles } = require("../auth");

const bidController = require("../controller/bidController");

router.route("/addBid").post(auth(roles.USER), bidController.addBid);

router.route("/getListingBids/:listingId").get(bidController.getListingBids);

router.route("/getAccountBids/:uname").get(bidController.getAccountBids);

router.route("/getWinningBid/:listingId").get(bidController.getWinningBid);

router
  .route("/updateWinnerBid/:bidId/:bidPrice")
  .put(bidController.updateWinnerBid);

module.exports = router;
