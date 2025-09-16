const mongoose = require('mongoose');

const serverChatHistorySchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    channelId: { type: String, required: true },
    userId: { type: String, required: true },
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
    message: { type: String, required: true },
    response: { type: String, default: '' },
    messageId: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServerChatHistory', serverChatHistorySchema);
