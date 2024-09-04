import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const category = 'core';
export const data = new SlashCommandBuilder()
	.setName('dump')
	.setDescription('Dump messages from current channel/thread into an OpenAI thread')
	.addStringOption((option) => option.setName('thread')
		.setDescription('OpenAI Thread ID')
		.setRequired(true)
	).addNumberOption((option) => option.setName('amount')
		.setDescription('Amount.')
		.setRequired(false)
	);

export async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });

	const threadId = interaction.options.getString('thread');
	const amount = interaction.options.getNumber('amount');
	console.log("ThreadId:", threadId);
	console.log("Amount:", amount);

	const channelMessages = await interaction.channel.messages.fetch();
	// load oldest messages first. could change sort value in request?
	const messages = Array.from(channelMessages.values()).map(msg => msg.content).reverse();
	// remove empty messages
	const filteredMessages = messages.filter(msg => !!msg && msg !== '');

	let activeThread = null;
	try {
		console.log(`Fetching thread ${threadId}...`);
		const thread = await openai.beta.threads.retrieve(threadId);
		console.log(`Thread retrieved: ${thread.id}`);
		activeThread = thread;
	} catch (error) {
		if (error instanceof OpenAI.NotFoundError) {
			console.error("NotFoundError!", error.message);
			const thread = await openai.beta.threads.create();
			console.log(`New thread created: ${thread.id}`);
			activeThread = thread;
		} else if (error instanceof OpenAI.APIError) {
			console.error("APIError!", error.message);
		}
	}

	let messageCount = 0;
	for await (const message of filteredMessages) {
		await openai.beta.threads.messages.create(
			activeThread.id,
			{
				role: "user",
				content: message,
			}
		)
		messageCount++;
	}

	const reply = `Added ${messageCount} messages to ${activeThread.id}`;
	console.log(reply);

	await interaction.followUp({ content: reply, ephemeral: true });
};
