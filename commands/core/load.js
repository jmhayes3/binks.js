const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const addMessage = (threadId, content) => {
	console.log("Adding message to OpenAI thread", threadId, ":", content);
	return openai.beta.threads.messages.create(
		threadId,
		{
			role: "user",
			content: content,
		}
	)
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('load')
		.setDescription('Load messages into an OpenAI thread.'),
	async execute(interaction) {
		await interaction.deferReply();

		const thread = await openai.beta.threads.create();
		const openaiThreadId = thread.id;

		// load messages from thread
		if (interaction.channel.isThread()) {
			const messagesRaw = await interaction.channel.messages.fetch();

			// load oldest messages first
			const messages = Array.from(messagesRaw.values()).map(msg => msg.content).reverse();
			console.log(messages);

			// remove empty messages
			const filteredMessages = messages.filter(msg => !!msg && msg !== '')
			console.log(filteredMessages);

			await Promise.all(filteredMessages.map(msg => addMessage(openaiThreadId, msg)));

			await interaction.followUp("Messages loaded into OpenAI thread: " + openaiThreadId);
		} else {
			await interaction.followUp({ content: "Load failed. Not in a thread." });
		}
	},
};
