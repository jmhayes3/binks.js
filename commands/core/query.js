import 'dotenv/config';
import { ActionRowBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { ComponentType } from 'discord-api-types/v10';
import { OpenAI } from 'openai';
import { sleep, splitString } from '../../utils.js';

const openai = new OpenAI({
  apiKey: process.env['OPENAI_API_KEY'],
});

export const category = 'core';
export const data = new SlashCommandBuilder()
  .setName('query')
  .setDescription('Query an assistant.')
  .addStringOption((option) =>
    option.setName('prompt')
      .setDescription('The input prompt.')
      .setRequired(true))
  .addStringOption((option) =>
    option.setName('assistant')
      .setDescription('The assistant to query.')
      .setRequired(false));

export async function execute(interaction) {
  const select = new StringSelectMenuBuilder()
    .setCustomId('model')
    .setPlaceholder('Select a model')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('gpt-4o')
        .setDescription('High-intelligence flagship model for complex, multi-step tasks.')
        .setValue('gpt-4o'),
      new StringSelectMenuOptionBuilder()
        .setLabel('gpt-4o-mini')
        .setDescription('Affordable and intelligent small model for fast, lightweight tasks.')
        .setValue('gpt-4o-mini'),
      new StringSelectMenuOptionBuilder()
        .setLabel('gpt-3.5-turbo')
        .setDescription('gpt-3.5-turbo')
        .setValue('gpt-3.5-turbo'),
    );

  const row = new ActionRowBuilder()
    .addComponents(select);

  const response = await interaction.reply({
    content: 'Select a model',
    components: [row],
  })

  const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 60_000 });

  collector.on('collect', async i => {
    const selection = i.values[0];
    await i.reply(`${i.user} has selected ${selection}!`);
  });

  // const collectorFilter = i => i.user.id === interaction.user.id;
  //
  // try {
  //   const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
  //   console.log(confirmation);
  //
  //   if (confirmation.customId === 'model') {
  //     await confirmation.update({ content: `${confirmation.customId} selected. Good choice.` })
  //   } else {
  //     await confirmation.update({ content: 'Invalid selection, action cancelled.', components: [] });
  //   }
  //
  // } catch (e) {
  //   console.log(e);
  //   await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
  // }

  // const filter = (i) => i.customId === 'model' && i.user.id === interaction.user.id;
  // const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
  //
  // collector.on('collect', async (i) => {
  //   if (!i.isStringSelectMenu()) return;
  //
  //   await i.update({ content: `You selected ${i.values[0]}`, components: [] });
  // });
  //
  // collector.on('end', (collected) => {
  //   if (collected.size === 0) {
  //     interaction.editReply({ content: 'You did not select any model.', components: [] });
  //   }
  // });
};
