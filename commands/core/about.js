const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { readFile } = require('fs/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('About.'),
  async execute(interaction) {
    // const image_file = await readFile('./data/image.jpg');
    // const attachment = new AttachmentBuilder(image_file, { name: 'data/image.jpg' });
    await interaction.reply({ content: "I am Binks, an AI-assisted chatbot.", ephemeral: true });
  },
};
