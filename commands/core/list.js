import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const getAssistants = async () => {
<<<<<<< Updated upstream
	const assistants = await openai.beta.assistants.list();
=======
	const payload = await openai.beta.assistants.list();
>>>>>>> Stashed changes
	const data = [];
	for (let i = 0; i < assistants.data.length; i++) {
		const text = `${assistants.data[i].name} (${assistants.data[i].model})`;
		data.push(text);
	}
	return data;
}

export const data = new SlashCommandBuilder()
	.setName('assistants')
	.setDescription('List available OpenAI assistants');

export async function execute(interaction) {
	await interaction.deferReply();

	const assistants = await getAssistants();
	const reply = assistants.join("\n");

	console.log(reply);

	await interaction.followUp({ content: reply, ephemeral: true });
}
