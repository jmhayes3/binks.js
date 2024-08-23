import { ContextMenuCommandBuilder, ApplicationCommandType } from 'discord.js';

export const data = new ContextMenuCommandBuilder().setName('Profile').setType(ApplicationCommandType.User);

export async function execute(interaction) {
	if (!interaction.isUserContextMenuCommand()) return;

	await interaction.deferReply({ ephemeral: true });

	const username = interaction.user.username;
	console.log(username);

	await interaction.followUp({ content: username, ephemeral: true });
};
