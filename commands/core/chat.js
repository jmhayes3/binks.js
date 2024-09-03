import 'dotenv/config';
import { SlashCommandBuilder } from 'discord.js';
import { OpenAI } from 'openai';
import { sleep, splitString } from '../../utils.js';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

// TODO: Clean this up.
const terminalStates = ["cancelled", "failed", "completed", "expired"];
const statusCheckLoop = async (threadId, runId) => {
  const run = await openai.beta.threads.runs.retrieve(threadId, runId);
  if (terminalStates.indexOf(run.status) < 0) {
    await sleep(1000);
    return statusCheckLoop(threadId, runId);
  }
  return run.status;
}

export const data = new SlashCommandBuilder()
  .setName('chat')
  .setDescription('Chat with an AI assistant')
  .addStringOption((option) => option.setName('prompt')
    .setDescription('Prompt')
    .setRequired(true)
  ).addStringOption((option) => option.setName('assistant')
    .setDescription('Assistant')
    .setRequired(false)
  );

export async function execute(interaction) {
  await interaction.deferReply();

  const interactionId = interaction.id;
  const prompt = interaction.options.getString('prompt');
  const assistant = interaction.options.getString('assistant');
  console.log("Interaction:", interactionId);
  console.log("Prompt:", prompt);
  console.log("Assistant:", assistant);

  // Create new thread.
  const thread = await openai.beta.threads.create();
  console.log("Thread created:", thread.id);

  // Add message to thread. 
  const message = await openai.beta.threads.messages.create(
    thread.id,
    {
      role: "user",
      content: prompt,
    }
  )
  console.log("Message added:", message.id);

  // Run the thread.
  const run = await openai.beta.threads.runs.create(
    thread.id,
    {
      assistant_id: assistant ?? process.env.ASSISTANT_ID,
    }
  )
  // const status = await statusCheckLoop(thread.id, run.id);
  await statusCheckLoop(thread.id, run.id);

  const messages = await openai.beta.threads.messages.list(thread.id);
  const replies = splitString(messages.data[0].content[0].text.value, 2000);

  await interaction.followUp(replies[0]);
  if (replies.length > 1) {
    for (let i = 1; i < replies.length; ++i) {
      await interaction.followUp(replies[i]);
    }
  }
};
