const mongoose = require('mongoose');

const dmChatHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
  message: { type: String, required: true },
  response: { type: String, default: '' },
  messageId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DMChatHistory', dmChatHistorySchema);
