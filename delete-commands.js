require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// for guild-based commands
// rest.delete(Routes.applicationGuildCommand(process.env.CLIENT_ID, process.env.GUILD_ID, '1272304273354395759'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// for global commands
// rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, 'globalCommandId'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);

// for all guild-based commands
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] })
	.then(() => console.log('Successfully deleted all guild commands.'))
	.catch(console.error);

// for all global commands
rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);
