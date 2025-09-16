const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charbtn:definition',
    async execute(interaction) {
        const [, charId] = interaction.customId.split(':');
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId(`charmod:definition:${charId}`)
            .setTitle('Edit Definition')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charDefinition').setLabel('Character Definition').setStyle(TextInputStyle.Paragraph).setValue(character.definition || '')
                )
            );

        return interaction.showModal(modal);
    }
};
