// events/interactionCreate.js
import { Events } from 'discord.js';

export const name = Events.InteractionCreate;
export const once = false;

export async function execute(interaction) {
  try {
    const command = interaction.client.commands.get(interaction.commandName);
    if (interaction.isChatInputCommand()) {
      console.log("chat input command");
      await command.execute(interaction);
    }
    else if (interaction.isUserContextMenuCommand()) {
      console.log("user context menu command");
      await command.execute(interaction);
    }
    else if (interaction.isMessageContextMenuCommand()) {
      console.log("message context menu command");
      await command.execute(interaction);
    }
    else {
      console.log("invalid command");
      return;
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    }
    else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
};
