const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();

const commands = [];

const commandsPath = path.join(__dirname, 'commands');

// Hàm đệ quy để duyệt toàn bộ thư mục con
function loadCommandsRecursively(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dir, file.name);
        if (file.isDirectory()) {
            loadCommandsRecursively(fullPath);
        } else if (file.isFile() && file.name.endsWith('.js')) {
            const command = require(fullPath);

            // Nếu là slash command
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            }
            // Nếu là prefix command
            else if ('name' in command && 'execute' in command) {
                console.log(`[INFO] Loaded prefix command: ${command.name}`);
            }
            // File lạ
            else {
                console.log(`[WARNING] The command at ${fullPath} is invalid.`);
            }
        }
    }
}


// Bắt đầu duyệt từ thư mục commands
loadCommandsRecursively(commandsPath);

// Thiết lập REST API
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Dùng lệnh toàn cục hay trong server test?
const isGuild = !!process.env.GUILD_ID;
const route = isGuild
    ? Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
    : Routes.applicationCommands(process.env.CLIENT_ID);

(async () => {
    try {
        console.log(`⛔ Clearing existing ${isGuild ? 'guild' : 'global'} commands...`);
        await rest.put(route, { body: [] }); // Xóa toàn bộ lệnh hiện tại
        console.log('✅ Successfully cleared all commands.');

        console.log(`🚀 Deploying ${commands.length} new ${isGuild ? 'guild' : 'global'} commands...`);
        const data = await rest.put(route, { body: commands });
        console.log(`✅ Successfully deployed ${data.length} commands.`);
    } catch (error) {
        console.error('❌ Error during deployment:', error);
    }
})();
