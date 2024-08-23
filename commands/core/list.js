import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const getAssistants = async () => {
	const payload = await openai.beta.assistants.list();
	// console.log(payload);
	const data = [];
	for (let i = 0; i < payload.data.length; i++) {
		console.log(payload.data[i]);
		const text = payload.data[i].name + " " + "(" + payload.data[i].model + ")";
		data.push(text);
	}
	return data;
}

export const data = new SlashCommandBuilder().setName('list').setDescription('List all available OpenAI assistants.');

export async function execute(interaction) {
	await interaction.deferReply();

	const assistants = await getAssistants();
	console.log(assistants);
	const reply = assistants.join("\n");

	await interaction.followUp({ content: reply, ephemeral: true });
}
