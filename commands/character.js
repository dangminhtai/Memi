const {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Manage your characters')
        .addSubcommand(sub =>
            sub
                .setName('create')
                .setDescription('Create a new character')
        ),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'create') {
            const modal = new ModalBuilder()
                .setCustomId('characterCreateModal')
                .setTitle('Create Character');

            const nameInput = new TextInputBuilder()
                .setCustomId('charName')
                .setLabel('Character Name')
                .setPlaceholder('Enter character name')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const taglineInput = new TextInputBuilder()
                .setCustomId('charTagline')
                .setLabel('Tagline')
                .setPlaceholder('Short introduction')
                .setStyle(TextInputStyle.Short)
                .setRequired(false);

            const descInput = new TextInputBuilder()
                .setCustomId('charDescription')
                .setLabel('Description')
                .setPlaceholder('Describe your character...')
                .setStyle(TextInputStyle.Paragraph)
                .setRequired(false);

            modal.addComponents(
                new ActionRowBuilder().addComponents(nameInput),
                new ActionRowBuilder().addComponents(taglineInput),
                new ActionRowBuilder().addComponents(descInput)
            );

            await interaction.showModal(modal);
        }
    },
};
