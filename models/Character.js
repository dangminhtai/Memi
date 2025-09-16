const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    avatarUrl: { type: String, default: null },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    greeting: { type: String, default: '' },
    aiGreeting: { type: Boolean, default: true },
    voice: { type: String, default: null },
    definition: { type: String, default: '' },
    visibility: { type: String, enum: ['public', 'unlisted', 'private'], default: 'public' },
    usageCount: { type: Number, default: 0 },    // số người dùng active
    messageCount: { type: Number, default: 0 },  // số tin nhắn nhân vật này chat
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Character', characterSchema);
