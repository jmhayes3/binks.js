import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const category = 'core';
export const data = new SlashCommandBuilder()
	.setName('assistant')
	.setDescription('Manage assistants.')
	.addSubcommand(subcommand =>
		subcommand
			.setName('list')
			.setDescription('List assistants.'))
	.addSubcommand(subcommand =>
		subcommand
			.setName('create')
			.setDescription('Create a new assistant.'))

export async function autocomplete(interaction) {
	// handle autocomplete
	console.log('handling autocomplete...');
	const focusedOption = interaction.options.getFocused(true);
	let choices;

	if (focusedOption.name === 'name') {
		choices = ['assistant1', 'assistant2', 'assistant3']
	}

	const filtered = choices.filter(choice => choice.startsWith(focusedOption.value));
	await interaction.respond(
		filtered.map(choice => ({ name: choice, value: choice })),
	);
}

export async function execute(interaction) {
	if (interaction.options.getSubcommand() == 'list') {
		console.log('list subcommand invoked')
		await interaction.deferReply();

		const assistants = await openai.beta.assistants.list();
		const payload = [];
		for (let i = 0; i < assistants.data.length; i++) {
			const text = `${assistants.data[i].name} (${assistants.data[i].model})`;
			payload.push(text);
		}
		const reply = payload.join("\n");

		await interaction.followUp({ content: reply, ephemeral: true });
	} else if (interaction.options.getSubcommand() == 'create') {
		console.log('create subcommand invoked')
		await interaction.deferReply();

		const reply = 'creating...';

		await interaction.followUp({ content: reply, ephemeral: true });
	}
}
