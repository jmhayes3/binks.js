import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
import { splitString } from '../../utils.js';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const data = new SlashCommandBuilder()
	.setName('load')
	.setDescription('Load an OpenAI thread into the current channel/thread')
	.addStringOption((option) => option.setName('thread')
		.setDescription('OpenAI thread ID')
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply({ ephemeral: true });

	// TODO: check cache first
	const threadId = interaction.options.getString('thread');

	const messagesList = await openai.beta.threads.messages.list(threadId);
	const messages = Array.from(messagesList.data).map(msg => msg.content).reverse();

	let messageCount = 0;
	let repliesSent = 0;
	for await (const msg of messages) {
		if (msg[0].text) {
			const text = msg[0].text.value;
			const replies = splitString(text, 2000);
			for (let i = 0; i < replies.length; i++) {
				await interaction.followUp({ content: replies[i] });
				repliesSent++;
			}
		}
		else if (msg[0].image_file) {
			const reply = "image file type";
			console.log(`Reply: ${reply}`);
			await interaction.followUp({ content: reply });
			repliesSent++;
		}
		else if (msg[0].image_url) {
			const reply = "image uri type";
			console.log(`Reply: ${reply}`);
			await interaction.followUp({ content: reply });
			repliesSent++;
		}
		messageCount++;
	}
	console.log(`Loaded ${messageCount} messages using ${repliesSent} replies.`);
	console.log(`OpenAI messages can be larger than the Discord max message size.`);
	console.log(`Therefore, we split large messages up into multiple replies.`);

	const reply = `Loaded ${repliesSent} messages into this channel/thread.`;
	console.log(`Reply: ${reply}`);

	await interaction.followUp({ content: reply, ephemeral: true });
};
