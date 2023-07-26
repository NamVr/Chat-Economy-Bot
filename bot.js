/**
 * @file Main File of the bot, responsible for registering events, commands, interactions etc.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.0.0
 */

// Declare constants which will be used throughout the bot.

const fs = require('fs');

const { Client, Collection, REST, Routes } = require('discord.js');

/**
 * @type {import('./typings').ConfigurationFile} Config File.
 */
const config = require('./config.json');
const { internal } = config;
const { token, client_id, guild_id } = internal;

const { version } = require('./package.json');

// Additional Required Modules
const fileExists = require('./functions/fileExists');
// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

/**
 * From v13, specifying the intents is compulsory.
 * @type {import("./typings").Client}
 * @description Main Application Client */

// @ts-ignore
const client = new Client({
	// Please add all intents you need, more detailed information @ https://ziad87.net/intents/
	intents: 45571,
});

/**********************************************************************/
// Error Notifier / Handler!
process.on('unhandledRejection', (error) => {
	log.critical(
		'**********************************************************************',
	);
	log.notice(
		'YOU NEED TO INCLUDE THIS INFORMATION IF YOU ASK FOR HELP ABOUT THE BELOW ERROR:',
	);
	log.notice(
		`NamVr Chat Economy v${version}, Node v${process.versions.node} on ${process.platform}`,
	);
	log.warn('NCE BOT ENCOUNTERED AN ERROR!');
	if (error instanceof Error) log.warn(`Uncaught ${error.name}`);
	log.error(error);
	log.critical(
		'**********************************************************************',
	);
});

/**********************************************************************/
// Path Checking For Required Files!
const requiredFiles = [
	'./config.json',
	'./database/shop.json',
	'./functions/banner.js',
	'./database/users.json',
];

for (const path of requiredFiles) {
	if (!fileExists(path)) {
		log.warn('A REQUIRED FILE IS MISSING!');
		log.error(
			`ERROR: CAN'T FIND CONFIGURATION FILE (${path}) Please make sure it exists!`,
		);
		process.exit(1);
	}
}

require('./functions/banner')();

/**********************************************************************/
// Below we will be making an event handler!

/**
 * @description All event files of the event handler.
 * @type {String[]}
 */

// Loop through all files and execute the event when it is actually emmited.
/**
 * @type {String[]}
 * @description All command categories aka folders.
 */

const eventFolders = fs.readdirSync('./events');

// Loop through all files and store commands in commands collection.

for (const folder of eventFolders) {
	const eventFiles = fs
		.readdirSync(`./events/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./events/${folder}/${file}`);
		if (event.once) {
			client.once(event.name, (...args) =>
				event.execute(...args, client),
			);
		} else {
			client.on(
				event.name,
				async (...args) => await event.execute(...args, client),
			);
		}
	}
}

/**********************************************************************/
// Define Collection of Commands, Slash Commands and cooldowns

client.commands = new Collection();
client.slashCommands = new Collection();
client.buttonCommands = new Collection();
client.selectCommands = new Collection();
client.contextCommands = new Collection();
client.modalCommands = new Collection();
client.cooldowns = new Collection();
client.triggers = new Collection();
client.autocompleteInteractions = new Collection();

// Economy Cache Handler

client.economy = {
	// You can extend properties as per your liking.
	heat: 0,
};

/**********************************************************************/
// Registration of Message-Based Legacy Commands.

/**
 * @type {String[]}
 * @description All command categories aka folders.
 */

const commandFolders = fs.readdirSync('./commands');

// Loop through all files and store commands in commands collection.

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

/**********************************************************************/
// Registration of Slash-Command Interactions.

/**
 * @type {String[]}
 * @description All slash commands.
 */

const slashCommands = fs.readdirSync('./interactions/slash');

// Loop through all files and store slash-commands in slashCommands collection.

for (const module of slashCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/slash/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/slash/${module}/${commandFile}`);
		client.slashCommands.set(command.data.name, command);
	}
}

/**********************************************************************/
// Registration of Autocomplete Interactions.

/**
 * @type {String[]}
 * @description All autocomplete interactions.
 */

const autocompleteInteractions = fs.readdirSync('./interactions/autocomplete');

// Loop through all files and store autocomplete interactions in autocompleteInteractions collection.

for (const module of autocompleteInteractions) {
	const files = fs
		.readdirSync(`./interactions/autocomplete/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const interactionFile of files) {
		const interaction = require(`./interactions/autocomplete/${module}/${interactionFile}`);
		client.autocompleteInteractions.set(interaction.name, interaction);
	}
}

/**********************************************************************/
// Registration of Context-Menu Interactions

/**
 * @type {String[]}
 * @description All Context Menu commands.
 */

const contextMenus = fs.readdirSync('./interactions/context-menus');

// Loop through all files and store context-menus in contextMenus collection.

for (const folder of contextMenus) {
	const files = fs
		.readdirSync(`./interactions/context-menus/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of files) {
		const menu = require(`./interactions/context-menus/${folder}/${file}`);
		const keyName = `${folder.toUpperCase()} ${menu.data.name}`;
		client.contextCommands.set(keyName, menu);
	}
}

/**********************************************************************/
// Registration of Button-Command Interactions.

/**
 * @type {String[]}
 * @description All button commands.
 */

const buttonCommands = fs.readdirSync('./interactions/buttons');

// Loop through all files and store button-commands in buttonCommands collection.

for (const module of buttonCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/buttons/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/buttons/${module}/${commandFile}`);
		client.buttonCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Modal-Command Interactions.

/**
 * @type {String[]}
 * @description All modal commands.
 */

const modalCommands = fs.readdirSync('./interactions/modals');

// Loop through all files and store modal-commands in modalCommands collection.

for (const module of modalCommands) {
	const commandFiles = fs
		.readdirSync(`./interactions/modals/${module}`)
		.filter((file) => file.endsWith('.js'));

	for (const commandFile of commandFiles) {
		const command = require(`./interactions/modals/${module}/${commandFile}`);
		client.modalCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of select-menus Interactions

/**
 * @type {String[]}
 * @description All Select Menu commands.
 */

const selectMenus = fs.readdirSync('./interactions/select-menus');

// Loop through all files and store select-menus in selectMenus collection.

for (const module of selectMenus) {
	const commandFiles = fs
		.readdirSync(`./interactions/select-menus/${module}`)
		.filter((file) => file.endsWith('.js'));
	for (const commandFile of commandFiles) {
		const command = require(`./interactions/select-menus/${module}/${commandFile}`);
		client.selectCommands.set(command.id, command);
	}
}

/**********************************************************************/
// Registration of Slash-Commands in Discord API

const rest = new REST({ version: '9' }).setToken(token);

const commandJsonData = [
	...Array.from(client.slashCommands.values()).map((c) => c.data.toJSON()),
	...Array.from(client.contextCommands.values()).map((c) => c.data),
];

(async () => {
	try {
		log.notice('Started refreshing application (/) commands.');

		await rest.put(
			/**
			 * By default, you will be using guild commands during development.
			 * Once you are done and ready to use global commands (which have 1 hour cache time),
			 * 1. Please uncomment the below (commented) line to deploy global commands.
			 * 2. Please comment the below (uncommented) line (for guild commands).
			 */

			Routes.applicationGuildCommands(client_id, guild_id),

			/**
			 * Good advice for global commands, you need to execute them only once to update
			 * your commands to the Discord API. Please comment it again after running the bot once
			 * to ensure they don't get re-deployed on the next restart.
			 */

			// Routes.applicationGuildCommands(client_id)

			{ body: commandJsonData },
		);

		log.success('Successfully reloaded application (/) commands.');
	} catch (error) {
		log.error(error);
	}
})();

/**********************************************************************/
// Registration of Message Based Chat Triggers

/**
 * @type {String[]}
 * @description All trigger categories aka folders.
 */

const triggerFolders = fs.readdirSync('./triggers');

// Loop through all files and store triggers in triggers collection.

for (const folder of triggerFolders) {
	const triggerFiles = fs
		.readdirSync(`./triggers/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of triggerFiles) {
		const trigger = require(`./triggers/${folder}/${file}`);
		client.triggers.set(trigger.name, trigger);
	}
}

// Login into your client application with bot's token.

client.login(token);

/* ********************************************
 *
 * This discord bot handler was cloned
 * from @NamVr/DiscordBot-Template
 * https://github.com/NamVr/DiscordBot-Template
 *
 * All questions regarding handlers should be
 * asked on the above repository.
 *
 ** ********************************************/
