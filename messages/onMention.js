/**
 * @file Default Bot Mention Command
 * @author Naman Vrati
 * @since 3.0.0
 */

/**
 * @type {import('../typings').ConfigurationFile} Config File.
 */
const config = require("../config.json");
const { settings } = config;
const { prefix } = settings;

module.exports = {
	/**
	 * @description Executes when the bot is pinged.
	 * @author Naman Vrati
	 * @param {import("discord.js").Message} message The Message Object of the command.
	 */

	async execute(message) {
		return message.channel.send(
			`Hi ${message.author}! My prefix is \`${prefix}\`, get help by \`${prefix}help\``
		);
	},
};
