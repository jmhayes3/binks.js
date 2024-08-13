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

const storeThread = (threadId, openaiThreadId) => {
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

  return run.status;
}

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

function splitString(str, length) {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }

  const segments = [];
  for (let i = 0; i < str.length; i += length) {
    segments.push(str.slice(i, i + length));
  }

  return segments;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('chat')
    .setDescription('Chat with an AI assistant.')
    .addStringOption((option) => option.setName('message').setDescription('Input text.').setRequired(true))
    .addStringOption((option) => option.setName('assistant').setDescription('Assistant ID.').setRequired(false)),
  async execute(interaction) {
    await interaction.deferReply();

    channelId = await interaction.channelId;
    console.log("Channel ID: ", channelId);

    const interactionId = interaction.id;
    console.log("Interaction ID: ", interactionId);

    const message = interaction.options.getString('message');
    console.log("Message: ", message);

    const assistantId = interaction.options.getString('assistant');
    console.log("Assistant ID: ", assistantId);

    // let openaiThreadId = loadThread(threadId);
    let openaiThreadId;

    if (!openaiThreadId) {
      const thread = await openai.beta.threads.create();
      openaiThreadId = thread.id;
    }

    await addMessage(openaiThreadId, message);

    storeThread(channelId, openaiThreadId);

    const run = await openai.beta.threads.runs.create(
      openaiThreadId,
      { assistant_id: assistantId || process.env.ASSISTANT_ID }
    )
    const status = await statusCheckLoop(openaiThreadId, run.id);
    console.log("Status: ", status);

    const messages = await openai.beta.threads.messages.list(openaiThreadId);
    let response = messages.data[0].content[0].text.value;

    const responses = splitString(response, 2000);

    console.log("Num Responses: ", responses.length);
    console.log("Responses: ", responses);

    await interaction.followUp(responses[0]);

    if (responses.length > 1) {
      for (let i = 1; i < responses.length; ++i) {
        console.log(i, responses[i]);
        // fetch channel and send message
        // channel = await interaction.client.channels.fetch(channelId);
        // replies.push(await channel.send(responses[i]));

        // use followUp instead (15 minute window after deferReply is sent)
        await interaction.followUp(responses[i]);
      }
    }
  },
};
