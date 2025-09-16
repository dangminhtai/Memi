const Character = require('../../../../models/Character');

module.exports = {
    id: 'charmod:visibility',
    async execute(interaction) {
        const [, , charId] = interaction.customId.split(':');
        const visibility = interaction.fields.getTextInputValue('charVisibility').trim().toLowerCase();

        if (!['public', 'unlisted', 'private'].includes(visibility)) {
            return interaction.reply({ content: '⚠️ Visibility must be one of: public, unlisted, private.', ephemeral: true });
        }

        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        character.visibility = visibility;
        character.updatedAt = new Date();
        await character.save();

        return interaction.reply({ content: `✅ Visibility updated for **${character.name}**.`, ephemeral: true });
    }
};
