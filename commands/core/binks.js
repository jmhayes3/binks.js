const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { readFile } = require('fs/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('binks')
    .setDescription('About.'),
  async execute(interaction) {
    // const image_file = await readFile('./data/image.jpg');
    // const attachment = new AttachmentBuilder(image_file, { name: 'data/image.jpg' });
    await interaction.reply({ content: "I am binks, an AI-assisted chatbot.", ephemeral: true });
  },
};
