import { SlashCommandBuilder } from 'discord.js';
import { checkVersion } from '../../utils.js';

export const data = new SlashCommandBuilder().setName('version').setDescription('Display version info');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const currentVersion = '0.1.0';
  const version = await checkVersion(currentVersion);

  await interaction.followUp({ content: version, ephemeral: true });
}
