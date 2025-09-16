const Character = require('../../../../models/Character');

module.exports = {
    id: 'charmod:definition',
    async execute(interaction) {
        const [, , charId] = interaction.customId.split(':');
        const definition = interaction.fields.getTextInputValue('charDefinition') || '';

        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        character.definition = definition;
        character.updatedAt = new Date();
        await character.save();

        return interaction.reply({ content: `✅ Definition updated for **${character.name}**.`, ephemeral: true });
    }
};
