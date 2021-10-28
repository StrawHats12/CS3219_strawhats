class Account {
  username;
  name;
  about;
  image;
  reviews;
  uid;

  constructor(body) {
    this.username = body.username;
    this.name = body.name;
    this.about = body.about;
    this.image = body.image;
    this.uid = body.uid;
    this.reviews = body.reviews || [];

    // Timestamp metadata
    this.createdAt = body.createdAt || Date.now();
    this.updatedAt = Date.now();
  }
}

module.exports = Account;
