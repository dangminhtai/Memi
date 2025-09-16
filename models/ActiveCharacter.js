const mongoose = require('mongoose');

const activeCharacterSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    setAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ActiveCharacter', activeCharacterSchema);
