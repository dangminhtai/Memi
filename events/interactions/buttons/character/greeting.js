const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charbtn:greeting',
    async execute(interaction) {
        const [, charId] = interaction.customId.split(':');
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId(`charmod:greeting:${charId}`)
            .setTitle('Edit Greeting')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charGreeting').setLabel('Greeting').setStyle(TextInputStyle.Paragraph).setValue(character.greeting || '')
                )
            );

        return interaction.showModal(modal);
    }
};
