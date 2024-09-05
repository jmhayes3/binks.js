import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const category = 'core';
export const data = new SlashCommandBuilder()
	.setName('assistants')
	.setDescription('List assistants.');

export async function execute(interaction) {
	await interaction.deferReply();

	const assistants = await openai.beta.assistants.list();
	const payload = [];
	for (let i = 0; i < assistants.data.length; i++) {
		const text = `${assistants.data[i].name} (${assistants.data[i].model})`;
		payload.push(text);
	}
	const reply = payload.join("\n");
	console.log(reply);
	await interaction.followUp({ content: reply, ephemeral: true });
}
