const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const listAssistants = async () => {
	console.log("Listing assistants...");

	const payload = await openai.beta.assistants.list();
	console.log("Payload:", payload);

	const assistants = Array.from(payload.values()).map(msg => msg.body);
	console.log("Assistants:", assistants);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List all available OpenAI assistants.'),
	async execute(interaction) {
		await interaction.deferReply();

		await listAssistants();

		await interaction.followUp("Available OpenAI assistants: ");
	},
};
