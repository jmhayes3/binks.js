const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('About me.'),
  async execute(interaction) {
    await interaction.reply({ content: "I am an AI-assisted chatbot.", ephemeral: true });
  },
};
