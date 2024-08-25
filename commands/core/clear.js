import { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear')
  .setDescription('Clear messages')
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption(option => option.setName('amount').setDescription('The number of messages to clear (up to 99)').setRequired(true))

export async function execute(interaction) {
  const { options } = interaction;

  const amount = options.getString('amount');
  const user = interaction.user.username;

  if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return interaction.reply({ content: 'Needs ManageMessages permission', ephemeral: true });
  }

  if (isNaN(amount) || parseInt(amount) < 1 || parseInt(amount) > 99) {
    return interaction.reply({ content: 'Please provide a valid number between 1 and 99.', ephemeral: true });
  }

  await interaction.deferReply({ ephemeral: true });

  const deletedSize = await deleteMessages(interaction.channel, parseInt(amount), user);

  const clearEmbed = new EmbedBuilder()
    .setColor('#333333')
    .setTitle(`Clear used in ${interaction.channel}`)
    .setFooter({ text: `Clear` })
    .setTimestamp()

  console.log(deletedSize);
  return interaction.followUp({ embeds: [clearEmbed], ephemeral: true });
}

async function deleteMessages(channel, amount) {
  const total = amount;

  // true arg forces the bot to delete msgs that older then 14 days
  const count = await channel.bulkDelete(total, true);
  console.log(count.size);
  console.log(count);

  return count;
}
