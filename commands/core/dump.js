import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
import { splitString } from '../../utils.js';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

export const data = new SlashCommandBuilder().setName('dump').setDescription('Dump messages from an OpenAI thread into a Discord thread.').addStringOption((option) => option.setName('thread').setDescription('OpenAI thread ID.').setRequired(true));

export async function execute(interaction) {
	await interaction.deferReply();

	const openaiThreadId = interaction.options.getString('thread');
	console.log(openaiThreadId);

	const messagesList = await openai.beta.threads.messages.list(openaiThreadId);
	console.log("Messages List:", messagesList);

	const messages = Array.from(messagesList.data).map(msg => msg.content).reverse();
	console.log(messages);

	for await (const msg of messages) {
		let content = null;
		if (msg[0].text) {
			content = msg[0].text.value;
			console.log("Content:", content);
			const replies = splitString(content, 2000);
			for (let i = 0; i < replies.length; i++) {
				console.log(replies[i]);
				await interaction.followUp({ content: replies[i] });
			}
		} else if (msg[0].image_file) {
			const image = msg[0].image_file;
			console.log("Image file:", image);
			await interaction.followUp({ content: image });
		} else if (msg[0].image_url) {
			const image = msg[0].image_url;
			console.log("Image url:", image);
			await interaction.followUp({ content: image });
		}
	}
};
