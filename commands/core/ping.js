import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('ping').setDescription('Send a ping.');

export async function execute(interaction) {
	const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });
	await interaction.editReply(`Round-trip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
};
