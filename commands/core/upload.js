const { readFile } = require('fs/promises');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('upload')
    .setDescription('Upload a file.'),
  async execute(interaction) {
    await interaction.deferReply();

    const image_file = await readFile('./data/image.jpg');
    const image_name = "data/image.jpg";
    const attachment = new AttachmentBuilder(image_file, { name: image_name });
    console.log("Attachment:", attachment);

    const response = "File uploaded.";
    await interaction.followUp({ content: response });
  },
};
