/**
 * @file Heat Handler
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

// Define Paths
const heatConfigPath = "./database/heat.json";

/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require("../../config.json");

const fs = require("fs");

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Main Heat Handling application starts here.

module.exports = {
	name: "messageCreate",

	/**
	 * @description Executes whenever a new message is sent to handle heat!
	 * @param {import('discord.js').Message & { client: import('../../typings').Client }} message The Message
	 */

	async execute(message) {
		// If the message author is a bot, do not affect heat.

		if (message.author.bot) return;

		// Tries reading required heat file. If it can't read, bot will be terminated, because they are required!

		try {
			var jsonString = fs.readFileSync(heatConfigPath, { encoding: "utf-8" });
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Tries parsing required heat file. If it can't read, bot will be terminated, because they are required!

		try {
			var heatConfig = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Check if the message is not sent in the heat channel, do not affect heat.

		if (message.channel.id !== config.settings.chat_channel) return;

		// On every message sent, heat gets increased as defined in config.json!

		heatConfig.heat += config.settings.heat_per_msg;

		// Now it will add heat in heat file.

		fs.writeFile(heatConfigPath, JSON.stringify(heatConfig, null, 2), (err) => {
			// IF ERROR BOT WILL BE TERMINATED!

			if (err) {
				log.error("Error writing file:", err);
				return process.exit(1);
			}
		});
	},
};
