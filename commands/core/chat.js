require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

const openai = new OpenAI({
	apiKey: process.env['OPENAI_API_KEY'],
});

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

const threadCache = {};

const loadThread = (threadId) => {
	// Replace this in-memory implementation with a database (e.g. DynamoDB, Firestore, Redis)
	return threadCache[threadId];
}

const addThreadToCache = (threadId, openaiThreadId) => {
	threadCache[threadId] = openaiThreadId;
}

const terminalStates = ["cancelled", "failed", "completed", "expired"];
const statusCheckLoop = async (openaiThreadId, runId) => {
	const run = await openai.beta.threads.runs.retrieve(
		openaiThreadId,
		runId
	);

	if (terminalStates.indexOf(run.status) < 0) {
		await sleep(1000);
		return statusCheckLoop(openaiThreadId, runId);
	}
	console.log("RUN: ", run);
	console.log("RUN STATUS: ", run.status);

	return run.status;
}

const addMessage = (threadId, content) => {
	console.log("Adding message to OpenAI thread: ", content)
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
		.setName('chat')
		.setDescription('Start a new chat.')
		.addStringOption((option) => option.setName('message').setDescription('Input text.').setRequired(true))
		.addStringOption((option) => option.setName('thread').setDescription('Thread ID.').setRequired(false))
		.addStringOption((option) => option.setName('assistant').setDescription('OpenAI Assistant ID.').setRequired(false)),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Thinking...', fetchReply: true });

		// TODO: Create proper discord thread from thread command option if
		// it doesn't already exist.
		// Check threadCache first.

		const interactionId = interaction.id;
		console.log("Interaction ID: ", interactionId);

		const message = interaction.options.getString('message');
		console.log("Message: ", message);

		const assistantId = interaction.options.getString('assistant');
		console.log("Assistant ID: ", assistantId);

		const threadId = interaction.options.getString('thread');
		console.log("Thread ID: ", threadId);

		if (threadId) {
			console.log(threadId);
		}

		let openaiThreadId = loadThread(interactionId);
		console.log("OpenAI Thread ID: ", openaiThreadId);

		if (!openaiThreadId) {
			const thread = await openai.beta.threads.create();
			openaiThreadId = thread.id;
			addThreadToCache(interactionId, openaiThreadId);
		}

		await addMessage(openaiThreadId, message);

		const run = await openai.beta.threads.runs.create(
			openaiThreadId,
			{ assistant_id: assistantId || process.env.ASSISTANT_ID }
		)
		const status = await statusCheckLoop(openaiThreadId, run.id);
		console.log("Status: ", status);

		const messages = await openai.beta.threads.messages.list(openaiThreadId);
		let response = messages.data[0].content[0].text.value;

		// TODO: split up messages
		response = response.substring(0, 1999)  // Discord message length?
		console.log("Response: ", response);

		interaction.editReply(`${response} (Latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms)`);
	},
};
