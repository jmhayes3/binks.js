import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { REST, Routes } from 'discord.js';

const commands = [];

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		console.log(filePath);
		const command = await import(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Install guild commands
try {
	console.log(`Started refreshing ${commands.length} guild application (/) commands.`);

	// The put method is used to fully refresh all commands
	const data = await rest.put(
		Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
		{ body: commands },
	);

	console.log(`Successfully reloaded ${data.length} guild application (/) commands.`);
} catch (error) {
	console.error(error);
}

// Install global commands
try {
	console.log(`Started refreshing ${commands.length} global application (/) commands.`);

	// The put method is used to fully refresh all commands
	const data = await rest.put(
		Routes.applicationCommands(process.env.CLIENT_ID),
		{ body: commands },
	);

	console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
} catch (error) {
	console.error(error);
}
