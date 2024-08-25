import { SlashCommandBuilder } from 'discord.js';
import { getLatestVersion } from '../../utils.js';

const VERSION = '0.0.1';

export const data = new SlashCommandBuilder().setName('version').setDescription('Display version info').addBooleanOption((option) => option.setName('check').setDescription('Check for update').setRequired(false));

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const current = VERSION;

  let reply = `You already have the latest version (${current}).`;

  const { options } = interaction;

  const check = options.getBoolean('check');
  if (check) {
    console.log('Checking for updates...')
    const latest = await getLatestVersion();
    if (current < latest) {
      reply = `The latest version is ${latest}. You are using version ${current}.`;
    }
  }
  else {
    console.log('Not checking for updates')
  }
  await interaction.followUp({ content: reply, ephemeral: true });
}
