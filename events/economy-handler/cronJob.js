/**
 * @file Initialize Cron Job
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

const manager = require("../../functions/database");
const random = require("../../functions/get/random-number");

const fs = require("fs");

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });
/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require("../../config.json");

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
			const heatConfig = manager.getHeatDB();

			// Check if heat has reached it's limit!

			if (heatConfig.heat >= config.settings.heat_max) {
				// Heat Event Activated!

				// Finds a random event.

				const chat_triggers = fs.readdirSync("./chat-triggers");
				const randomIndex = random(0, chat_triggers.length - 1);

				// Fetch the random event & execute the event.

				const event = require(`../../chat-triggers/${chat_triggers[randomIndex]}`);

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

				heatConfig.heat = 0;

				// Save the configuration.

				manager.putHeatDB(heatConfig);
			}
		}, config.settings.cooldown);
	},
};