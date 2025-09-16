// events/messageDispatcher.js
const { ChannelType } = require('discord.js');
const dmListener = require('./dm/messageListener');
const serverListener = require('./server/messageListener');
const UserSettings = require('../models/User'); // import model user settings

module.exports = {
  async execute(message) {
    if (message.author.bot) return;

    // 🔹 Kiểm tra user settings
    try {
      const settings = await UserSettings.findOne({ userId: message.author.id });

      if (settings && settings.settings?.messageContentIntent === false) {
        return;
      }

    } catch (err) {
      console.error('❌ Lỗi khi check user settings:', err);
    }

    // 🔹 Phân luồng DM / Server
    if (message.channel.type === ChannelType.DM) {
      return dmListener.execute(message);
    } else if (message.guild) {
      return serverListener.execute(message);
    }
  }
};
