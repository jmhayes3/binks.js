import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('role').setDescription('Display role info').addRoleOption(option => option.setName('role').setDescription("The role you want to get the info of").setRequired(true));

export async function execute(interaction) {
    const { options } = interaction;

    const role = options.getRole('role');

    if (!role || !role.id) return interaction.reply({ content: `That role **doesn't** seem to exist in ${interaction.guild.name}`, ephemeral: true });
    if (role.name === "@everyone") return interaction.reply({ content: `You **cannot** get the info of the \`\`@everyone\`\``, ephemeral: true });
    if (role.name === "@here") return interaction.reply({ content: `You **cannot** get the info of the \`\`@here\`\``, ephemeral: true });

    const created = parseInt(role.createdTimestamp / 1000);
    const isMentionable = role.isMentionable ? "true" : "false";
    const isManaged = role.isManaged ? "true" : "false";
    const isHigher = role.isHigher ? "true" : "false";
    const position = role.position;
    const isBotRole = role.isBotRole ? "true" : "false";

    const roleEmbed = new EmbedBuilder()
        .setColor(role.color)
        .setTitle("Role info")
        .addFields(
            { name: "Name", value: `> ${role.name}` },
            { name: "Color", value: `> ${role.hexColor}` },
            { name: "Mention", value: `> @${role.name}` },
            { name: "Hoisted", value: `> ${isHigher}` },
            { name: "Position", value: `> ${position}` },
            { name: "Mentionable", value: `> ${isMentionable}` },
            { name: "Managed", value: `> ${isManaged}` },
            { name: "Bot", value: `> ${isBotRole}` },
            { name: "Created", value: `> <t:${created}:R>` })
        .setFooter({ text: `Role ID: ${role.id}` })
        .setThumbnail(role.iconURL());

    await interaction.reply({ embeds: [roleEmbed], ephemeral: true })
}
