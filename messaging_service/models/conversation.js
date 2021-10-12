class Conversation {
  id;
  members;
  createdAt;
  updatedAt;

  constructor(body) {
    this.members = body.members;

    // Generate ID's if needed
    this.id = body.id || this.#generateId();

    // Timestamp metadata
    this.createdAt = body.createdAt || Date.now();
    this.updatedAt = Date.now();
  }

  #generateId = () => {
    const buff = Buffer.from(Date.now().toString());
    return buff.toString("base64");
  };
}

module.exports = Conversation;
