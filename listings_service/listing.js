const STATUS_ENUM = ["AVAILABLE", "SOLD"];

class Listing {
  id;
  seller_uid;
  listing_name;
  description;
  images;
  deadline;
  bidding_id;
  status = "AVAILABLE";
  createdAt;
  updatedAt;

  constructor(body) {
    this.seller_uid = body.seller_uid;
    this.listing_name = body.listing_name;
    this.description = body.description;
    this.images = body.images || [];
    this.deadline = body.deadline;
    this.id = body.id;
    this.bidding_id = body.id;

    // Timestamp metadata
    this.createdAt = body.createdAt || Date.now();
    this.updatedAt = Date.now();
  }

  setStatus(status) {
    if (!status in STATUS_ENUM) {
      throw new Error("Invalid Status");
    }

    this.status = status;
    return this;
  }
}

module.exports = Listing;
