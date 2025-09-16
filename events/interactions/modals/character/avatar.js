const Character = require('../../../../models/Character');

module.exports = {
    id: 'charmod:avatar',
    async execute(interaction) {
        const [, , charId] = interaction.customId.split(':');
        const avatarUrl = interaction.fields.getTextInputValue('charAvatar').trim();

        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        character.avatarUrl = avatarUrl || null;
        character.updatedAt = new Date();
        await character.save();

        return interaction.reply({ content: `✅ Avatar updated for **${character.name}**.`, ephemeral: true });
    }
};
