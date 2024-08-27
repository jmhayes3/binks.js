import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

// export const data = new SlashCommandBuilder().setName('load').setDescription('Load messages into an OpenAI thread.');
export const data = new SlashCommandBuilder()
	.setName('load')
	.setDescription('Add messages to an OpenAI thread.')
	.addStringOption((option) => option.setName('thread')
		.setDescription('OpenAI thread ID.')
		.setRequired(false)
	);

export async function execute(interaction) {
	await interaction.deferReply({ ephemeral: false });

	let reply = null;
	if (interaction.channel.isThread()) {
		const messagesRaw = await interaction.channel.messages.fetch();

		// load oldest messages first
		const messages = Array.from(messagesRaw.values()).map(msg => msg.content).reverse();

		// remove empty messages
		const filteredMessages = messages.filter(msg => !!msg && msg !== '')

		// TODO: Check cache first. If cached, only upload messages newer than the
		// timestamp of the last cached message.
		const thread = await openai.beta.threads.create();

		let messageCount = 0;
		for await (const message of filteredMessages) {
			await openai.beta.threads.messages.create(
				thread.id,
				{
					role: "user",
					content: message,
				}
			)
			messageCount++;
		}
		reply = `Successfully added ${messageCount} messages to ${thread.id}`;
	} else {
		reply = "Failed: Not in a thread.";
	}

	if (reply) {
		console.log("Reply:", reply);
		await interaction.followUp({ content: reply, ephemeral: false });
	}
};
