const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const getAssistants = async () => {
	const payload = await openai.beta.assistants.list();
	return Array.from(payload.data).map(msg => msg.name);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('list')
		.setDescription('List all available OpenAI assistants.'),
	async execute(interaction) {
		await interaction.deferReply();

		const assistants = await getAssistants();
		const reply = assistants.join("\n");

		await interaction.followUp({ content: reply, ephemeral: true });
	},
};
