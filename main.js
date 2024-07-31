require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { OpenAI } = require("openai");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const threadMap = {};

const getOpenAiThreadId = (discordThreadId) => {
    // Replace this in-memory implementation with a database (e.g. DynamoDB, Firestore, Redis)
    return threadMap[discordThreadId];
}

const addThreadToMap = (discordThreadId, openAiThreadId) => {
    threadMap[discordThreadId] = openAiThreadId;
}

const terminalStates = ["cancelled", "failed", "completed", "expired"];
const statusCheckLoop = async (openAiThreadId, runId) => {
    const run = await openai.beta.threads.runs.retrieve(
        openAiThreadId,
        runId
    );

    if (terminalStates.indexOf(run.status) < 0) {
        await sleep(1000);
        return statusCheckLoop(openAiThreadId, runId);
    }
    console.log("RUN: ", run);

    return run.status;
}

const addMessage = (threadId, content) => {
    console.log("ADDING CONTENT: ", content)
    return openai.beta.threads.messages.create(
        threadId,
        { role: "user",
          content: content,
        }
    )
}

function rollDice(dice) {
    let [num, sides] = dice.split('d').map(Number);
    let results = [];
    for (let i = 0; i < num; i++) {
        results.push(Math.floor(Math.random() * sides) + 1);
    }
    return results.join(', ');
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// This event will run every time a message is received.
client.on('messageCreate', async message => {
    console.log(message)
    // Ignore bot messages.
    if (message.author.bot || !message.content || message.content === '') {
      return;
    }

    if (message.content.startsWith('!roll')) {
      const input = message.content.replace('!roll', '').trim();
      if (input.length === 0) {
        message.reply('Please specify the type of dice to roll in the format XdY (e.g. 3d10)');
        return;
      }
      const roll = rollDice(input);
      message.reply(roll)
    }

    // Return if message doesn't start with !binks.
    if (message.content.startsWith('!binks')) {
      const msg = message.content.replace('!binks', '').trim();
      if (msg.length === 0) {
        message.reply('Please provide a question or instruction.');
        return;
      }

      const discordThreadId = message.channel.id;
      let openAiThreadId = getOpenAiThreadId(discordThreadId);
      let messagesLoaded = false;

      if (!openAiThreadId) {
          const thread = await openai.beta.threads.create();
          openAiThreadId = thread.id;
          addThreadToMap(discordThreadId, openAiThreadId);
          if (message.channel.isThread()){
              // Gather all thread messages to fill out the OpenAI thread since
              // we haven't seen this one yet.
              const starterMsg = await message.channel.fetchStarterMessage();
              const otherMessagesRaw = await message.channel.messages.fetch();

              const otherMessages = Array.from(otherMessagesRaw.values())
                  .map(msg => msg.content)
                  .reverse(); // oldest first

              const messages = [starterMsg.content, ...otherMessages]
                  .filter(msg => !!msg && msg !== '')

              // console.log(messages);
              await Promise.all(messages.map(msg => addMessage(openAiThreadId, msg)));
              messagesLoaded = true;
          }
      }

      if (message.attachments.size > 0) {
          message.attachments.forEach(async (attachment) => {
              console.log(`Attachment URL: ${attachment.url}`);
          });
      } else {
          console.log('No attachments found.');
      }

      if (!messagesLoaded) {
          // If this is for a thread, assume msg was loaded via .fetch() earlier.
          await addMessage(openAiThreadId, message.content);
      }

      const run = await openai.beta.threads.runs.create(
          openAiThreadId,
          { assistant_id: process.env.ASSISTANT_ID }
      )
      const status = await statusCheckLoop(openAiThreadId, run.id);

      const messages = await openai.beta.threads.messages.list(openAiThreadId);
      let response = messages.data[0].content[0].text.value;

      // Discord msg length limit when I was testing.
      response = response.substring(0, 1999)

      console.log(response);
      message.reply(response);
    } else {
      return;
    }
});

client.login(process.env.DISCORD_TOKEN);
