const Character = require('../models/Character');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // 🔹 Slash commands
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;

                try {
                    await command.execute(interaction);
                } catch (err) {
                    console.error(`❌ Error executing /${interaction.commandName}:`, err);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: '❌ Failed to execute command.', ephemeral: true });
                    } else {
                        await interaction.reply({ content: '❌ Failed to execute command.', ephemeral: true });
                    }
                }
                return;
            }

            // 🔹 Modal: Character Create
            if (interaction.isModalSubmit() && interaction.customId === 'characterCreateModal') {
                const name = interaction.fields.getTextInputValue('charName');
                const tagline = interaction.fields.getTextInputValue('charTagline') || '';
                const description = interaction.fields.getTextInputValue('charDescription') || '';

                try {
                    // Validate
                    if (!name || name.trim().length === 0) {
                        return interaction.reply({
                            content: '⚠️ Character name cannot be empty.',
                            ephemeral: true,
                        });
                    }

                    // Check duplicate
                    const existing = await Character.findOne({ name, ownerId: interaction.user.id });
                    if (existing) {
                        return interaction.reply({
                            content: `⚠️ You already created a character named **${name}**.`,
                            ephemeral: true,
                        });
                    }

                    const character = new Character({
                        name,
                        tagline,
                        description,
                        ownerId: interaction.user.id,
                    });

                    await character.save();

                    return interaction.reply({
                        content: `✅ Character **${name}** created successfully!`,
                        ephemeral: true,
                    });
                } catch (err) {
                    console.error('❌ Error creating character:', err);
                    if (interaction.replied || interaction.deferred) {
                        await interaction.followUp({ content: '❌ Failed to create character.', ephemeral: true });
                    } else {
                        await interaction.reply({ content: '❌ Failed to create character.', ephemeral: true });
                    }
                }
            }

            // 🔹 Button & Select Menu (placeholder)
            if (interaction.isButton()) {
                return interaction.reply({ content: `🔘 Button **${interaction.customId}** clicked.`, ephemeral: true });
            }

            if (interaction.isStringSelectMenu()) {
                return interaction.reply({ content: `📋 You chose: ${interaction.values.join(', ')}`, ephemeral: true });
            }

        } catch (error) {
            console.error('❌ Unhandled interaction error:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: '❌ Something went wrong handling this interaction.', ephemeral: true });
            }
        }
    },
};
