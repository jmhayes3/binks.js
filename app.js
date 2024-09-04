import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';

const client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
	]
});

client.commands = new Collection();

const foldersPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = await import(filePath);
		if ('data' in command && 'execute' in command) {
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.once(Events.ClientReady, () => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
	client.user.setPresence({ activities: [], status: 'online' });
});

client.on(Events.InteractionCreate, async (interaction) => {
	try {
		const command = interaction.client.commands.get(interaction.commandName);
		if (interaction.isChatInputCommand()) {
			console.log("chat input command");
			await command.execute(interaction);
		}
		else if (interaction.isUserContextMenuCommand()) {
			console.log("user context menu command");
			await command.execute(interaction);
		}
		else if (interaction.isMessageContextMenuCommand()) {
			console.log("message context menu command");
			await command.execute(interaction);
		}
		else {
			console.log("invalid command");
			return;
		}
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
