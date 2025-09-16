// models/InteractionMessage.js
const mongoose = require('mongoose');

const interactionMessageSchema = new mongoose.Schema({
    messageId: { type: String, required: true }, // ID tin nhắn bot gửi
    customId: { type: String, required: true },  // ID button hoặc select menu
    userId: { type: String, required: true },    // Ai bấm được (để hạn chế)
    guildId: { type: String, default: null },    // null = DM
    channelId: { type: String, required: true },
    type: { type: String, enum: ['button', 'menu'], default: 'button' },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date } // có thể set TTL auto xóa
});

// Tự động xóa record sau khi hết hạn (VD 15 phút)
interactionMessageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('InteractionMessage', interactionMessageSchema);
