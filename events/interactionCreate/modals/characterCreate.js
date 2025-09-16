const Character = require('../../models/Character');

module.exports = {
    async execute(interaction) {
        const name = interaction.fields.getTextInputValue('charName');
        const tagline = interaction.fields.getTextInputValue('charTagline') || '';
        const description = interaction.fields.getTextInputValue('charDescription') || '';

        try {
            if (!name || name.trim().length === 0) {
                return interaction.reply({ content: '⚠️ Character name cannot be empty.', ephemeral: true });
            }

            const existing = await Character.findOne({ name, ownerId: interaction.user.id });
            if (existing) {
                return interaction.reply({ content: `⚠️ You already created **${name}**.`, ephemeral: true });
            }

            const character = new Character({ name, tagline, description, ownerId: interaction.user.id });
            await character.save();

            return interaction.reply({ content: `✅ Character **${name}** created successfully!`, ephemeral: true });

        } catch (err) {
            console.error('❌ Error creating character:', err);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: '❌ Failed to create character.', ephemeral: true });
            } else {
                await interaction.reply({ content: '❌ Failed to create character.', ephemeral: true });
            }
        }
    }
};
