const mongoose = require("mongoose");

const chatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  messages: [
    {
      role: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const ChatHistory = mongoose.model("ChatHistory", chatHistorySchema);

module.exports = ChatHistory;