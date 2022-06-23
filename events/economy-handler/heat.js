/**
 * @file Heat Handler
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require("../../config.json");

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

		let heat = message.client.economy.heat;

		// Check if the message is not sent in the heat channel, do not affect heat.

		if (message.channel.id !== config.settings.chat_channel) return;

		// On every message sent, heat gets increased as defined in config.json!

		heat += config.settings.heat_per_msg;

		// Now it will add heat in heat file.

		message.client.economy.heat = heat;

		return;
	},
};
