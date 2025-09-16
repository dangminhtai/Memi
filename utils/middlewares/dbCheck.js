const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// utils/middlewares/dbCheck.js 
const mongoose = require('mongoose');
let sentWarning = false;

async function dbCheck(ctx) {
    if (mongoose.connection.readyState !== 1) {
        const errorMessage = "⚠️ Database is currently not connected.";

        if (!sentWarning) {
            sentWarning = true;
            try {
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setLabel('Contact Admin')
                        .setStyle(ButtonStyle.Link)
                        .setURL('https://discord.gg/GkRRamE3Zh')
                );

                if (ctx.reply) {
                    await ctx.reply({ content: errorMessage, components: [row], ephemeral: true });
                } else if (ctx.channel) {
                    await ctx.channel.send({ content: errorMessage, components: [row] });
                }
            } catch (err) {
                console.error('❌ Error while sending DB not connected message:', err);
            }
        }

        return false;
    }

    if (sentWarning) {
        console.log("✅ Database reconnected");
        sentWarning = false;
    }

    return true;
}

module.exports = dbCheck;
