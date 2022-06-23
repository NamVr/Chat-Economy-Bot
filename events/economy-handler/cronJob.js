/**
 * @file Initialize Cron Job
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

const { settings } = require("../../config.json");
const { cooldown } = settings;

const manager = require("../../functions/database");

const fs = require("fs");
const { Collection } = require("discord.js");

// Main cron job application starts here.

module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes the block of code when client is ready (bot initialization)
	 * @param {import('../../typings').Client} client Main Application Client
	 */

	execute(client) {
		setInterval(() => {
			let heat = client.economy.heat;

			// Get config file.
			const config = manager.getConfigFile();

			// Check if heat has reached it's limit!

			if (heat >= config.settings.heat_max) {
				// Heat Event Activated!

				// Finds a random event.

				const chat_triggers = fs.readdirSync("./chat-triggers");

				/**
				 * @type {Collection<string, import("../../typings").ChatTriggerEvent>}
				 */
				const modules = new Collection();

				/**
				 * Enabled modules collection.
				 * @type {Collection<string, import("../../typings").ChatTriggerEvent>}
				 */
				const enabledModules = new Collection();

				// Loop through all files and store commands in commands collection.

				for (const trigger of chat_triggers) {
					const module = require(`../../chat-triggers/${trigger}`);
					modules.set(module.name, module);
				}

				// Filter only enabled modules (from config.json).

				modules.forEach((module) => {
					if (config.modules[module.alias])
						enabledModules.set(module.name, module);
				});

				// Fetch the random event & execute the event.

				const event = enabledModules.random();

				// Find the Heat Channel.

				let channel = client.channels.cache.get(config.settings.chat_channel);

				// Check if your input channel is a Text-Based Channel.

				if (!channel) {
					log.critical(
						`${config.settings.chat_channel} does NOT belong to ANY Channel!`
					);
					log.error(
						"Please fix your configuration file with a correct Heat Channel ID."
					);
					process.exit(1);
				}

				if (channel.type != "GUILD_TEXT" && channel.type != "DM") {
					log.critical(`${channel.name} is NOT a Text Channel!`);
					log.error(
						"Please fix your configuration file (config.json) and setup the correct Heat Channel ID."
					);
					process.exit(1);
				}

				// Fetch the Latest Message & Execute the random event.

				channel.messages.fetch({ limit: 1 }).then((messages) => {
					let message = messages.first();

					// Check if there's no existing message (Purge?)

					if (!message) {
						return;
					}
					// @ts-ignore
					event.execute(message);
				});

				// Set new heat to zero.

				heat = 0;

				// Save the configuration.

				client.economy.heat = heat;
			}
		}, cooldown);
	},
};
