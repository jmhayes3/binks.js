import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('info').setDescription('Display app information');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });
  const content = "App info.";
  await interaction.followUp({ content: content, ephemeral: true });
};
