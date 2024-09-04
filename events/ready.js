import { Events } from 'discord.js';

export const name = Events.ClientReady;
export const once = true;

export function execute(interaction) {
  const { user } = interaction;
  console.log(`Ready! Logged in as ${user.tag}`);
  user.setPresence({ activities: [], status: 'online' });
}
