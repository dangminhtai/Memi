module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // 🔹 Slash commands
            if (interaction.isChatInputCommand()) {
                console.log(`💬 Slash command: /${interaction.commandName} by ${interaction.user.tag}`);
                const cmd = interaction.client.commands.get(interaction.commandName);
                if (cmd) return cmd.execute(interaction);
                console.warn(`⚠️ No handler found for slash command: /${interaction.commandName}`);
            }

            // 🔹 Buttons
            if (interaction.isButton()) {
                const parts = interaction.customId.split(':');
                const key = `${parts[0]}:${parts[2]}`; // ví dụ "charbtn:basic"
                console.log(`🔘 Button pressed: customId=${interaction.customId}, parsedKey=${key}, by ${interaction.user.tag}`);
                const handler = interaction.client.buttons.get(key);
                if (handler) return handler.execute(interaction);
                console.warn(`⚠️ No handler found for button key: ${key}`);
            }

            // 🔹 Modals
            if (interaction.isModalSubmit()) {
                const parts = interaction.customId.split(':');
                const key = `${parts[0]}:${parts[1]}`; // ví dụ "charmod:basic"
                console.log(`📑 Modal submitted: customId=${interaction.customId}, parsedKey=${key}, by ${interaction.user.tag}`);
                const handler = interaction.client.modals.get(key);
                if (handler) return handler.execute(interaction);
                console.warn(`⚠️ No handler found for modal key: ${key}`);
            }
        } catch (err) {
            console.error('❌ Error in interactionCreate handler:', err);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Something went wrong.',
                    ephemeral: true,
                });
            }
        }
    }
};
