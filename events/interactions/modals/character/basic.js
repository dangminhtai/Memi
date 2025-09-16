//events/interactions/modals/character/basic.js
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charmod:basic',
    async execute(interaction) {
        const [, , charId] = interaction.customId.split(':');
        const name = interaction.fields.getTextInputValue('charName').trim();
        const tagline = interaction.fields.getTextInputValue('charTagline') || '';
        const description = interaction.fields.getTextInputValue('charDescription') || '';

        if (!name) return interaction.reply({ content: '⚠️ Name cannot be empty.', ephemeral: true });
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        character.name = name;
        character.tagline = tagline;
        character.description = description;
        character.updatedAt = new Date();
        await character.save();

        return interaction.reply({ content: `✅ Basic info updated for **${character.name}**.`, ephemeral: true });
    }
};
