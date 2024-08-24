import { readFile } from 'node:fs/promises';
import { SlashCommandBuilder, AttachmentBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('upload').setDescription('Upload a file');

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const image_file = await readFile('./data/image.jpg');
  const image_name = "data/image.jpg";
  const image_description = "Image file."

  const attachment = new AttachmentBuilder(image_file, { name: image_name, description: image_description });
  console.log("Attachment:", attachment);

  const response = "File uploaded.";
  await interaction.followUp({ content: response, ephemeral: true });
};
