// events/guildCreate.js
const { ChannelType, PermissionFlagsBits } = require('discord.js');
module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    try {

      let systemChannel = guild.systemChannel;

      if (
        systemChannel &&
        guild.members.me &&
        !systemChannel
          .permissionsFor(guild.members.me)
          ?.has([PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages])
      ) {
        systemChannel = null;
      }

      if (!systemChannel) {
        const channels = await guild.channels.fetch();
        systemChannel = channels.find(
          c =>
            c.type === ChannelType.GuildText &&
            c.permissionsFor(guild.members.me)?.has([
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
            ])
        );
      }

      if (systemChannel) {
        await systemChannel.send(
          `🌟 Hello I am here`

        );

        console.log(`📬 Đã gửi chào mừng đến ${guild.name}`);
      } else {
        console.warn(
          `⚠️ Không tìm được kênh phù hợp để gửi chào mừng trong ${guild.name}`
        );
      }
    } catch (err) {
      console.error('❌ Lỗi trong guildCreate:', err);
    }
  },
};
