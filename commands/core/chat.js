require('dotenv').config();

const { SlashCommandBuilder } = require('discord.js');
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
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

    const thread = await openai.beta.threads.create();
    const openaiThreadId = thread.id;

    await addMessage(openaiThreadId, message);

    const run = await openai.beta.threads.runs.create(
      openaiThreadId,
      { assistant_id: assistantId || process.env.ASSISTANT_ID }
    )
    const status = await statusCheckLoop(openaiThreadId, run.id);
    console.log("Status: ", status);

    const messages = await openai.beta.threads.messages.list(openaiThreadId);
    const response = messages.data[0].content[0].text.value;

    const responses = splitString(response, 2000);

    console.log("Num Responses: ", responses.length);
    console.log("Responses: ", responses);

    await interaction.followUp(responses[0]);

    if (interaction.channel.isThread()) {
      console.log("is thread");
      console.log(interaction.channel);
    } else {
      console.log("not thread");
      console.log(interaction.channel);
    }

    if (responses.length > 1) {
      for (let i = 1; i < responses.length; ++i) {
        console.log(responses[i]);

        await interaction.followUp(responses[i]);
      }
    }
  },
};
