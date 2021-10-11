class Bid {
    listing_id;
    bid_id;
    createdAt;
    endBidDateTime;
    status = "ONGOING";
    bidPrice;
    bidOwner;

    constructor(body) {
        this.listing_id = body.listing_id;
        this.auction_id = body.auction_id;
        this.bid_id = body.bid_id || this.#generateId();
        this.bidPrice = body.bidPrice
        this.createdAt = Date.now();
        this.bidOwner = body.user;
        if (Date.now() > body.endBidDateTime) {
            throw err;
        }
        this.endAt = body.endAt;
    }

    setDelete() {
        this.status = "DELETED";
        return this;
    }

    #generateId () {
        // ID: Unique bidder id + current time converted to base64 string thanks samuel
        const buff = Buffer.from(this.bidding_id + Date.now().toString());
        return buff.toString("base64");
    }
}

module.exports = Bid;