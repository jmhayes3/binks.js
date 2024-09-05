import fs from 'fs';
import fetch from 'node-fetch';
import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';
import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const category = 'core';
export const data = new SlashCommandBuilder()
  .setName('upload')
  .setDescription('Upload a file.')
  .addAttachmentOption(option =>
    option.setName('attach')
      .setDescription('File attachment.')
      .setRequired(true));

export async function execute(interaction) {
  console.log(interaction);;
  const attachment = await interaction.options.getAttachment('attach');
  console.log(attachment);

  // Check if the interaction contains any attachments
  // if (!interaction.attachments) {
  //   return interaction.reply('Please upload a file.');
  // }

  // Get the first attachment
  const file = attachment.attachment;
  console.log(file);
  const fileUrl = attachment.url;
  console.log(fileUrl);

  // Display information about the uploaded file
  await interaction.reply(`Received file: ${file.name} (${file.size} bytes)`);

  // Fetch the file content from the URL
  const response = await fetch(fileUrl);
  const buffer = await response.buffer();
  console.log(response);
  console.log(buffer);

  // Set a `name` that ends with .png so that the API knows it's a PNG image
  buffer.name = "image.png";

  // Save the file content to a local file
  fs.writeFileSync(`./${buffer.name}`, buffer);

  await interaction.followUp('File has been downloaded and saved locally.');

  console.log('creating variation with dall-e-2')
  const image = await openai.images.createVariation({
    image: fs.createReadStream('image.png'),
  });

  console.log(image);
  console.log('---------------');
  console.log(image.data);

  // Build attachment and reply to user.
}
