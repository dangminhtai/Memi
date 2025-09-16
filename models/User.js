const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  displayName: { type: String, default: '' },
  region: { type: String, default: '' },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  settings: {
    messageContentIntent: { type: Boolean, default: false }, // on/off
    // có thể mở rộng: allowDM, nsfwMode, notification,...
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
