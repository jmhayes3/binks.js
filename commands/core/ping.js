const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Send a ping.'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true });

		await interaction.editReply(`Round-trip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
