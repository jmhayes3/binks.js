import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('server').setDescription('Display server info');

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	await interaction.deferReply({ ephemeral: true });

	const server = interaction.guild;
	const members = interaction.guild.memberCount;
	const created = parseInt(interaction.guild.createdTimestamp / 1000);

	const serverEmbed = new EmbedBuilder()
		.setColor('#777777')
		.setTitle("Server info")
		.addFields(
			{ name: "Name", value: `> ${server.name}` },
			{ name: "Members", value: `> ${members}` },
			{ name: "Owner ID", value: `> ${server.ownerId}` },
			{ name: "Created", value: `> <t:${created}:R>` })
		.setFooter({ text: `Server ID: ${server.id}` })
		.setThumbnail(server.iconURL())

	const reply = { embeds: [serverEmbed], ephemeral: true };
	await interaction.followUp(reply);
};
