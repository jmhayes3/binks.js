import { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } from 'discord.js';

export const data = new ContextMenuCommandBuilder()
	.setName('User Info')
	.setType(ApplicationCommandType.User);

export async function execute(interaction) {
	if (!interaction.isUserContextMenuCommand()) return;

	await interaction.deferReply({ ephemeral: true });

	const user = interaction.user;
	const created = parseInt(interaction.user.createdTimestamp / 1000);
	const userContextMenuEmbed = new EmbedBuilder()
		.setColor('#195ece')
		.setTitle("User info")
		.addFields(
			{ name: "Username", value: `> ${user.username}` },
			{ name: "Joined", value: `> <t:${created}:R>` })
		.setFooter({ text: `User ID: ${user.id}` })
		.setThumbnail(user.displayAvatarURL());

	const reply = { embeds: [userContextMenuEmbed], ephemeral: true };
	console.log(reply);

	await interaction.followUp(reply);
};
