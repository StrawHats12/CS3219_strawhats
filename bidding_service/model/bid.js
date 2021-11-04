class Bid {
  listingId;
  auctionId;
  bidId;
  bidPrice;
  createdAt;
  status = "ONGOING";
  bidOwner;

  constructor(body) {
    this.listingId = body.listingId;
    this.auctionId = body.auctionId;
    this.bidId = body.bidId || this.#generateId();
    this.bidPrice = parseInt(body.bidPrice);
    this.createdAt = body.createdAt || Date.now();
    this.bidOwner = body.bidOwner;
  }

  setWinner() {
    this.status = "WINNER";
    return this;
  }

  #generateId = () => {
    // ID: Unique bidder id + current time converted to base64 string thanks samuel
    const buff = Buffer.from(this.bidding_id + Date.now().toString());
    return buff.toString("base64");
  };
}

module.exports = Bid;
