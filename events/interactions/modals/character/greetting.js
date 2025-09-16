const Character = require('../../../../models/Character');

module.exports = {
    id: 'charmod:greeting',
    async execute(interaction) {
        const [, , charId] = interaction.customId.split(':');
        const greeting = interaction.fields.getTextInputValue('charGreeting') || '';

        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        character.greeting = greeting;
        character.updatedAt = new Date();
        await character.save();

        return interaction.reply({ content: `✅ Greeting updated for **${character.name}**.`, ephemeral: true });
    }
};
