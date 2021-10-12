class Account {
  username;
  name;
  about;
  image;
  reviews;

  constructor(body) {
    this.username = body.username;
    this.name = body.name;
    this.about = body.about;
    this.image = body.image;
    this.reviews = body.reviews || [];

    // Timestamp metadata
    this.createdAt = body.createdAt || Date.now();
    this.updatedAt = Date.now();
  }
}

module.exports = Account;
