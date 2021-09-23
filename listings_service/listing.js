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

    // Generate ID's if needed
    this.id = body.id || this.#generateId();
    this.bidding_id = body.id || this.id;

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

  #generateId() {
    // ID: Unique seller id + current time converted to base64 string
    const buff = Buffer.from(this.seller_uid + Date.now().toString());
    return buff.toString("base64");
  }
}

module.exports = Listing;
