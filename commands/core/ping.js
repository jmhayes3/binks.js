const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Send a ping.'),
	async execute(interaction) {
		// await interaction.reply('Pong!');
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		interaction.editReply(`Round-trip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
	},
};
