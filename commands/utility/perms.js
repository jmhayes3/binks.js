import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName("permissions")
  .setDescription("Display user permissions")
  .addUserOption(option => option.setName("user").setDescription("The user to get permissions for").setRequired(false))

export async function execute(interaction) {
  if (!interaction.isChatInputCommand()) return;

  const { options } = interaction;
  const member = options.getMember("user") || interaction.member;
  const user = options.getUser("user") || interaction.user;

  if (!member) return interaction.reply({ content: "Member **could not** be found!", ephemeral: true, });

  let permissionFlags = Object.keys(PermissionFlagsBits);
  let output = `**Permissions for** **${member}:**  \n\`\`\``;
  for (let i = 0; i < permissionFlags.length; i++) {
    let permissionName = permissionFlags[i];
    let hasPermission = member.permissions.has(permissionName);
    output += `${permissionName} ${hasPermission ? "true" : "false"}\n`;
  }
  output += `\`\`\``;

  const PermsEmbed = new EmbedBuilder()
    .setTitle('Permissions')
    .setDescription(`> **${user.tag}** permissions in **${interaction.guild.name}** \n\n${output}`)
    .setColor('#555555')
    .setThumbnail(user.avatarURL())
    .setFooter({ text: `${user.tag} permissions` })
    .setTimestamp();

  return interaction.reply({ embeds: [PermsEmbed] });
}
