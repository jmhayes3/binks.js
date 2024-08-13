const { ChannelType, ThreadAutoArchiveDuration } = require('discord.js');

const threadName = "new-thread";

const new_thread = await channel.threads.create({
  name: threadName,
  autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
  type: ChannelType.PrivateThread,
  reason: "Private chat thread.",
});
console.log("Thread created: ", new_thread);
