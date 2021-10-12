class Message {
  id;
  conversation_id;
  sender_id;
  text;
  created_at;
  updated_at;

  constructor(body) {
    this.conversation_id = body.conversation_id;
    this.sender_id = body.sender_id;
    this.text = body.text;

    // Generate ID's if needed
    this.id = body.id || this.#generateId();

    // Timestamp metadata
    this.created_at = body.created_at || Date.now();
    this.updated_at = Date.now();
  }

  #generateId = () => {
    // ID: Unique conversation id + current time converted to base64 string
    const buff = Buffer.from(this.conversation_id + Date.now().toString());
    return buff.toString("base64");
  };
}

module.exports = Message;
