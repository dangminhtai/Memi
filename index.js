require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const { Client, GatewayIntentBits, Collection, Events, Partials } = require('discord.js');
const connectDB = require('./db');
const guildCreateHandler = require('./events/guildCreate');
const dbCheck = require('./utils/middlewares/dbCheck');
// === 1. Khởi tạo Discord Client ===
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
    partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember]
});

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllFiles(fullPath, arrayOfFiles);
        } else if (file.endsWith('.js')) {
            arrayOfFiles.push(fullPath);
        }
    }
    return arrayOfFiles;
}


// === 2. Tải Slash Commands từ thư mục ===

client.commands = new Collection();

const commands = [];


const { withValidation } = require('./utils/middlewares/withValidation.js');
const commandFiles = getAllFiles(path.join(__dirname, 'commands'));

for (const file of commandFiles) {
    try {
        let command = require(file);

        // ✅ Bọc command bằng middleware
        command = withValidation(path.dirname(file), command);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`✅ Đã load lệnh: ${command.data.name}`);
        } else {
            console.warn(`⚠️ Thiếu "data" hoặc "execute" trong lệnh: ${file}`);
        }
    } catch (err) {
        console.error(`❌ Lỗi khi load lệnh từ: ${file}`, err);
    }
}
//loads buttons
client.buttons = new Collection();
const buttonFiles = getAllFiles(path.join(__dirname, 'events/interactions/buttons'));
for (const file of buttonFiles) {
    const button = require(file);
    if ('id' in button && 'execute' in button) {
        client.buttons.set(button.id, button);
        console.log(`✅ Đã load button: ${button.id}`);
    } else {
        console.warn(`⚠️ Button thiếu "id" hoặc "execute": ${file}`);
    }
}
//loads modals
client.modals = new Collection();
const modalFiles = getAllFiles(path.join(__dirname, 'events/interactions/modals'));
for (const file of modalFiles) {
    const modal = require(file);
    if ('id' in modal && 'execute' in modal) {
        client.modals.set(modal.id, modal);
        console.log(`✅ Đã load modal: ${modal.id}`);
    } else {
        console.warn(`⚠️ Modal thiếu "id" hoặc "execute": ${file}`);
    }
}

const interactionHandler = require('./events/interactionCreate');
client.on(Events.InteractionCreate, async (interaction) => {
    if (!(await dbCheck(interaction))) return; // check DB trước
    await interactionHandler.execute(interaction);
});

const messageListener = require('./events/messageDispatcher');

client.on(Events.MessageCreate, async (message) => {
    if (!(await dbCheck(message))) return; // check DB trước
    try {
        await messageListener.execute(message);
    } catch (error) {
        console.error('❌ Lỗi khi xử lý tin nhắn:', error);
    }
});


// === 6. Express giữ bot sống trên Render ===
const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`🌐 Express server đang chạy tại http://localhost:${PORT}`);
});

// === 7. Đăng nhập bot và kết nối MongoDB ===
client.once(Events.ClientReady, () => {
    console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);
});

async function main() {
    try {
        console.log('🔌 Kết nối MongoDB...');
        await connectDB(); // DB chính
        await client.login(process.env.DISCORD_TOKEN);
        console.log(`✅ Đăng nhập Discord thành công: ${client.user.tag}`);
    } catch (err) {
        console.error('❌ Lỗi khi khởi động bot:', err);
    }
    client.on(Events.GuildCreate, guildCreateHandler.execute);
}

main();
