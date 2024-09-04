import { SlashCommandBuilder } from 'discord.js';

export const category = 'utility';
export const data = new SlashCommandBuilder()
  .setName('reload')
  .setDescription('Reload a command')
  .addStringOption(option =>
    option.setName('command')
      .setDescription('The command to reload')
      .setRequired(true))

export async function execute(interaction) {
  const commandName = interaction.options.getString('command', true).toLowerCase();
  const command = interaction.client.commands.get(commandName);

  if (!command) {
    return interaction.reply(`There is no command with name \`${commandName}\`!`);
  }

  try {
    if (!command.category) {
      await interaction.reply('Command does not have a category')
    } else {
      interaction.client.commands.delete(command.data.name);
      const newCommand = await import(`../${command.category}/${command.data.name}.js`);
      interaction.client.commands.set(newCommand.data.name, newCommand);
      await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
  }
}
