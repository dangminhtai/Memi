function validateCommandUsage(interaction, __dirname) {
  const isDM = interaction.channel?.isDMBased?.();
  const isServer = !isDM;

  const ADMIN_ID = '1149477475001323540';

  // 1. Nếu lệnh trong folder DM → chỉ dùng ở DM
  if (__dirname.includes('/dm') || __dirname.includes('\\dm')) {
    if (isServer) {
      return '❌ This command can only be used in DMs.';
    }
  }

  // 2. Nếu lệnh trong folder SERVER → chỉ dùng ở server và phải là admin
  if (__dirname.includes('/server') || __dirname.includes('\\server')) {
    if (isDM) {
      return '❌ This command can only be used in servers.';
    }

    const member = interaction.member;
    if (!member?.permissions?.has?.('Administrator')) {
      return '❌ Only server administrators can use this command.';
    }
  }

  // 3. Nếu lệnh trong folder ADMIN → chỉ ADMIN_ID mới được dùng
  if (__dirname.includes('/admin') || __dirname.includes('\\admin')) {
    if (interaction.user.id !== ADMIN_ID) {
      return '❌ Only the bot owner can use this command.';
    }
  }

  // 4. Joined only (chỉ server cụ thể)
  if (__dirname.includes('/joined') || __dirname.includes('\\joined')) {
    const ALLOWED_GUILD_ID = '1377349839150649454'; // server chính
    const memberInAllowedServer = interaction.client.guilds.cache
      .get(ALLOWED_GUILD_ID)
      ?.members.cache.has(interaction.user.id);

    if (!memberInAllowedServer) {
      return '⚠️ You must be a member of the official server to use this command.\n [Official Server](https://discord.gg/jtCrdcvbeR)';
    }
  }

  // 4. Nếu không nằm trong dm/server/admin thì hợp lệ
  return null;
}

module.exports = validateCommandUsage;