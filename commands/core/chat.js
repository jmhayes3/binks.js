import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
import { sleep, splitString } from '../../utils.js';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

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

export const data = new SlashCommandBuilder().setName('chat').setDescription('Start a chat with an AI assistant.').addStringOption((option) => option.setName('prompt').setDescription('Prompt.').setRequired(true)).addStringOption((option) => option.setName('assistant').setDescription('Assistant ID.').setRequired(false));

export async function execute(interaction) {
  await interaction.deferReply();

  const channelId = await interaction.channelId;
  console.log("Channel ID: ", channelId);

  const interactionId = interaction.id;
  console.log("Interaction ID: ", interactionId);

  const message = interaction.options.getString('prompt');
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
};
