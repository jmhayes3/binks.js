import { SlashCommandBuilder } from 'discord.js';

// TODO: Get version from package.json
const VERSION = '0.1.0';

export const data = new SlashCommandBuilder()
  .setName('version')
  .setDescription('Display version info');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  let reply = `You already have the latest version (${VERSION}).`;
  try {
    const response = await fetch('https://github.com/jmhayes3/binks.js/releases/latest');
    console.log(response);
    const tag = response.url.split('/').at(-1);
    const version = tag.split('v').at(-1);
    reply = version;
  } catch (error) {
    console.error(`Error while retrieving the latest version. No release found.\n ${error}`);
  }

  if (VERSION < latest) {
    reply = `The latest version is ${latest}. You are using version ${VERSION}.`;
  }

  await interaction.followUp({ content: reply, ephemeral: true });
}
