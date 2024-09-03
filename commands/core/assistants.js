import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const data = new SlashCommandBuilder()
	.setName('assistants')
	.setDescription('List available assistants');

export async function execute(interaction) {
	await interaction.deferReply();

	const assistants = await openai.beta.assistants.list();
	const payload = [];
	for (let i = 0; i < assistants.payload.length; i++) {
		const text = `${assistants.payload[i].name} (${assistants.payload[i].model})`;
		payload.push(text);
	}
	const reply = assistants.join("\n");
	console.log(reply);
	await interaction.followUp({ content: reply, ephemeral: true });
}
