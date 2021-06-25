require("dotenv").config();
const token = process.env.DB_TOKEN;

// REQUIRED MODULES
const fs = require("fs");
const Discord = require("discord.js");
const client = new Discord.Client();
const fileExists = require("file-exists");
const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });
const { version } = require("./package.json");

// CURRENCY REQUIREMENTS - Copy paste in currency commands.
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("./database/dbObjects"); // CHANGE PATH IN COMMANDS FILE!
const currency = new Discord.Collection();

// ERROR HANDLER - LOGGER.
process.on("unhandledRejection", (error) => {
	log.notice(
		"YOU NEED TO INCLUDE THIS INFORMATION IF YOU ASK FOR HELP ABOUT THE BELOW ERROR:"
	);
	log.notice(
		`NamVr Chat Economy v${version}, Node v${process.versions.node} on ${process.platform}`
	);
	log.warn("NCE BOT ENCOUNTERED AN ERROR!");
	if (error instanceof Error) log.warn(`Uncaught ${error.name}`);
	log.error(error);
});

// PATH CHECKING!
const configPath = "./config.json";
const heatPath = "./database/heat.json";
const envPath = "./.env";
const dbPath = "./database/database.sqlite";
const dbInit = "./database/dbInit.js";

require("./database/banner")();

if (!fileExists.sync(configPath)) {
	log.warn("A REQUIRED FILE IS MISSING!");
	log.error(
		`ERROR: CAN'T FIND CONFIGURATION FILE (config.json) Please make sure it exists!`
	);
	process.exit(1);
} else if (!fileExists.sync(heatPath)) {
	log.warn("A REQUIRED FILE IS MISSING!");
	log.error(
		`ERROR: CAN'T FIND CONFIGURATION FILE (./database/heat.json) Please make sure it exists!`
	);
	process.exit(1);
} else if (!fileExists.sync(envPath)) {
	log.warn("A REQUIRED FILE IS MISSING!");
	log.error(
		`ERROR: CAN'T FIND ENCRYPTION FILE (.env) Please make sure it exists!`
	);
	process.exit(1);
} else if (!fileExists.sync(dbPath)) {
	log.warn("A REQUIRED FILE IS MISSING!");
	log.error(`ERROR: CAN'T FIND DATABASE! CREATING ONE FOR YOU!`);
	require("child_process").fork(dbInit); // Creates Database!
	log.success("The Database was created successfully!");
} else {
	log.notice("ALL REQUIRED CONFIGURATION FILES WERE FOUND!");
}

// Event Handler.
const eventFiles = fs
	.readdirSync("./events")
	.filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args, client));
	} else {
		client.on(event.name, (...args) => event.execute(...args, client));
	}
}

// Command Handler.
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`./commands/${folder}`)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.name, command);
	}
}

// Login into your bot!
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
