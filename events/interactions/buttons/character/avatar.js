const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../../../../models/Character');

module.exports = {
    id: 'charbtn:avatar',
    async execute(interaction) {
        const [, charId] = interaction.customId.split(':');
        const character = await Character.findById(charId);
        if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

        const modal = new ModalBuilder()
            .setCustomId(`charmod:avatar:${charId}`)
            .setTitle('Edit Avatar URL')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder().setCustomId('charAvatar').setLabel('Avatar URL').setStyle(TextInputStyle.Short).setValue(character.avatarUrl || '')
                )
            );

        return interaction.showModal(modal);
    }
};
