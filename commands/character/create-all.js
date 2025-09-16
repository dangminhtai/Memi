// commands/character/create-all.js
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Character = require('../../models/Character');
const InteractionMessage = require('../../models/InteractionMessage');

function makeToken() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('character')
        .setDescription('Manage your characters')
        .addSubcommand(sub =>
            sub.setName('create')
                .setDescription('Create a new character')
                .addStringOption(o => o.setName('scope')
                    .setDescription('What to create')
                    .setRequired(false)
                    .addChoices({ name: 'all', value: 'all' })
                )
        ),

    async execute(interaction) {
        // chỉ cho user tự tạo
        const scope = interaction.options.getString('scope') || 'all';
        // tạo character rỗng (ownerId)
        const char = await Character.create({
            name: `New Character`, // tạm; user sẽ edit ngay
            ownerId: interaction.user.id,
            tagline: '',
            description: '',
        });

        // 5 button (anh chỉ yêu cầu 1 đầu tiên; em đặt thêm 4 placeholder)
        const tokenBasic = makeToken();
        const btnBasic = new ButtonBuilder()
            .setCustomId(`charbtn:${char._id}:basic:${tokenBasic}`)
            .setLabel('Edit Basic Info')
            .setStyle(ButtonStyle.Primary);

        const tokenGreeting = makeToken();
        const btnGreeting = new ButtonBuilder()
            .setCustomId(`charbtn:${char._id}:greeting:${tokenGreeting}`)
            .setLabel('Edit Greeting')
            .setStyle(ButtonStyle.Secondary);

        const tokenAvatar = makeToken();
        const btnAvatar = new ButtonBuilder()
            .setCustomId(`charbtn:${char._id}:avatarUrl:${tokenAvatar}`)
            .setLabel('Edit Avatar')
            .setStyle(ButtonStyle.Secondary);

        const tokenVisibility = makeToken();
        const btnVisibility = new ButtonBuilder()
            .setCustomId(`charbtn:${char._id}:visibility:${tokenVisibility}`)
            .setLabel('Edit Visibility')
            .setStyle(ButtonStyle.Secondary);

        const tokenDefinition = makeToken();
        const btnDefinition = new ButtonBuilder()
            .setCustomId(`charbtn:${char._id}:definition:${tokenDefinition}`)
            .setLabel('Edit Definition')
            .setStyle(ButtonStyle.Secondary);

        const rows = [];
        // max 5 per row (we have 5)
        const row1 = new ActionRowBuilder().addComponents([btnBasic, btnGreeting, btnAvatar, btnVisibility, btnDefinition]);
        rows.push(row1);

        const embed = new EmbedBuilder()
            .setTitle('Character Created — Editor')
            .setDescription('Dùng các nút bên dưới để chỉnh từng phần cho nhân vật của bạn.\n**Lưu ý:** các nút và modal được lưu vĩnh viễn trong DB.')
            .addFields(
                { name: 'Character ID', value: String(char._id) },
                { name: 'Owner', value: `${interaction.user.tag}` }
            )
            .setColor(0x6CA0FF);

        // gửi message (không ephemeral — cần tồn tại để bấm lâu dài)
        const msg = await interaction.reply({ embeds: [embed], components: rows, fetchReply: true });

        // lưu vào InteractionMessage (không set expiresAt -> sẽ không auto-delete)
        const docs = [
            { messageId: msg.id, customId: btnBasic.data.custom_id, userId: interaction.user.id, guildId: interaction.guildId ?? null, channelId: interaction.channelId, type: 'button' },
            { messageId: msg.id, customId: btnGreeting.data.custom_id, userId: interaction.user.id, guildId: interaction.guildId ?? null, channelId: interaction.channelId, type: 'button' },
            { messageId: msg.id, customId: btnAvatar.data.custom_id, userId: interaction.user.id, guildId: interaction.guildId ?? null, channelId: interaction.channelId, type: 'button' },
            { messageId: msg.id, customId: btnVisibility.data.custom_id, userId: interaction.user.id, guildId: interaction.guildId ?? null, channelId: interaction.channelId, type: 'button' },
            { messageId: msg.id, customId: btnDefinition.data.custom_id, userId: interaction.user.id, guildId: interaction.guildId ?? null, channelId: interaction.channelId, type: 'button' },
        ];

        await InteractionMessage.insertMany(docs);

        // thông báo hoàn tất
        return;
    }
};
