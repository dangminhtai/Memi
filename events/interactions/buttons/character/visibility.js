const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charbtn:visibility',
    async execute(interaction) {
        const [, charId] = interaction.customId.split(':');
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId(`charmod:visibility:${charId}`)
            .setTitle('Edit Visibility')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charVisibility').setLabel('Visibility (public/unlisted/private)').setStyle(TextInputStyle.Short).setValue(character.visibility || 'public')
                )
            );

        return interaction.showModal(modal);
    }
};
