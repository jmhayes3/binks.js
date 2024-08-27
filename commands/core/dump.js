import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
import { splitString } from '../../utils.js';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const data = new SlashCommandBuilder()
	.setName('dump')
	.setDescription('Dump messages from an OpenAI thread into the channel/thread')
	.addStringOption((option) => option.setName('thread')
		.setDescription('OpenAI thread')
		.setRequired(true)
	);

export async function execute(interaction) {
	await interaction.deferReply();

	// TODO: check cache first
	const openaiThreadId = interaction.options.getString('thread');

	const messagesList = await openai.beta.threads.messages.list(openaiThreadId);
	const messages = Array.from(messagesList.data).map(msg => msg.content).reverse();

	let replyCount = 0;
	for await (const msg of messages) {
		if (msg[0].text) {
			const text = msg[0].text.value;
			const replies = splitString(text, 2000);
			for (let i = 0; i < replies.length; i++) {
				console.log(`Sending reply ${i} of ${replies.length}`);
				await interaction.followUp({ content: replies[i] });
				replyCount++;
			}
		} else if (msg[0].image_file) {
			const reply = "image file type";
			console.log(`Reply: ${reply}`);
			await interaction.followUp({ content: reply });
			replyCount++;
		} else if (msg[0].image_url) {
			const reply = "image uri type";
			console.log(`Reply: ${reply}`);
			await interaction.followUp({ content: reply });
			replyCount++;
		}
	}

	const reply = `Added ${replyCount} messages to this thread.`;
	console.log(reply);
	await interaction.followUp({ content: reply, ephemeral: false });
};
