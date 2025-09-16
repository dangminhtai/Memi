// events/interactionCreate.js
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const Character = require('../models/Character');
const InteractionMessage = require('../models/InteractionMessage');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // --- Slash commands forwarding (giữ nguyên) ---
            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);
                if (!command) return;
                return command.execute(interaction);
            }

            // --- Button click ---
            if (interaction.isButton()) {
                // only handle charbtn: prefix
                if (!interaction.customId.startsWith('charbtn:')) return;

                // Validate via DB
                const record = await InteractionMessage.findOne({
                    customId: interaction.customId,
                    messageId: interaction.message.id
                });

                if (!record) {
                    return interaction.reply({ content: '❌ Interaction expired or invalid.', ephemeral: true });
                }
                if (record.userId !== interaction.user.id) {
                    return interaction.reply({ content: '⚠️ Bạn không có quyền bấm nút này.', ephemeral: true });
                }

                // parse: charbtn:<charId>:<field>:<token>
                const [, charId, field /*, token*/] = interaction.customId.split(':');

                // If user clicked "basic" => open modal with 3 fields
                if (field === 'basic') {
                    const character = await Character.findById(charId);
                    if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

                    const modal = new ModalBuilder()
                        .setCustomId(`charmod:basic:${charId}`)
                        .setTitle('Edit Basic Info');

                    const nameInput = new TextInputBuilder()
                        .setCustomId('charName')
                        .setLabel('Character Name')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setValue(character.name || '');

                    const taglineInput = new TextInputBuilder()
                        .setCustomId('charTagline')
                        .setLabel('Tagline')
                        .setStyle(TextInputStyle.Short)
                        .setRequired(false)
                        .setValue(character.tagline || '');

                    const descInput = new TextInputBuilder()
                        .setCustomId('charDescription')
                        .setLabel('Description')
                        .setStyle(TextInputStyle.Paragraph)
                        .setRequired(false)
                        .setValue(character.description || '');

                    modal.addComponents(
                        new ActionRowBuilder().addComponents(nameInput),
                        new ActionRowBuilder().addComponents(taglineInput),
                        new ActionRowBuilder().addComponents(descInput)
                    );

                    return interaction.showModal(modal);
                }

                // handle other fields (greeting/avatar/visibility/definition) if you want later
                return interaction.reply({ content: `⚠️ Button for "${field}" not implemented yet.`, ephemeral: true });
            }

            // --- Modal submit ---
            if (interaction.isModalSubmit()) {
                // modal id format: charmod:basic:<charId>
                if (!interaction.customId.startsWith('charmod:')) return;

                const parts = interaction.customId.split(':');
                // parts: ['charmod','basic','<charId>']
                const [, kind, charId] = parts;

                if (kind === 'basic') {
                    const name = interaction.fields.getTextInputValue('charName').trim();
                    const tagline = interaction.fields.getTextInputValue('charTagline') || '';
                    const description = interaction.fields.getTextInputValue('charDescription') || '';

                    // basic validation
                    if (!name) {
                        return interaction.reply({ content: '⚠️ Name cannot be empty.', ephemeral: true });
                    }

                    const character = await Character.findById(charId);
                    if (!character) return interaction.reply({ content: '❌ Character not found.', ephemeral: true });

                    // check duplicate name for this user (excluding current character)
                    const duplicate = await Character.findOne({ ownerId: interaction.user.id, name });
                    if (duplicate && duplicate._id.toString() !== charId) {
                        return interaction.reply({ content: '⚠️ You already have a character with that name.', ephemeral: true });
                    }

                    // update fields
                    character.name = name;
                    character.tagline = tagline;
                    character.description = description;
                    character.updatedAt = new Date();
                    await character.save();

                    return interaction.reply({ content: `✅ Basic info updated for **${character.name}**.`, ephemeral: true });
                }

                // other modal kinds if add later
            }

        } catch (err) {
            console.error('❌ interactionCreate error:', err);
            try { if (!interaction.replied && !interaction.deferred) await interaction.reply({ content: '❌ Something went wrong.', ephemeral: true }); } catch (e) { }
        }
    }
};
