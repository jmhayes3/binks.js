import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export const data = new SlashCommandBuilder().setName('user').setDescription('Display user info');

export async function execute(interaction) {
	if (!interaction.isChatInputCommand()) return;

	await interaction.deferReply({ ephemeral: true });

	const user = interaction.user;
	const created = parseInt(interaction.user.createdTimestamp / 1000);

	const userEmbed = new EmbedBuilder()
		.setColor('#195ece')
		.setTitle("User info")
		.addFields(
			{ name: "Username", value: `> ${user.username}` },
			{ name: "Joined", value: `> <t:${created}:R>` })
		.setFooter({ text: `User ID: ${user.id}` })
		.setThumbnail(user.displayAvatarURL());

	const reply = { embeds: [userEmbed], ephemeral: true };
	console.log(reply);

	await interaction.followUp(reply);
};
