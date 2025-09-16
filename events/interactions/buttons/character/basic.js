//events/interactions/buttons/character/basic.js
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charbtn:basic',
    async execute(interaction) {
        const [, charId] = interaction.customId.split(':');
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId(`charmod:basic:${charId}`)
            .setTitle('Edit Basic Info')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charName').setLabel('Character Name').setStyle(TextInputStyle.Short).setValue(character.name)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charTagline').setLabel('Tagline').setStyle(TextInputStyle.Short).setValue(character.tagline || '')
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charDescription').setLabel('Description').setStyle(TextInputStyle.Paragraph).setValue(character.description || '')
                )
            );

        return interaction.showModal(modal);
    }
};
