/**
 * @file Guild Handler
 * @author NamVr
 * @since 1.0.0
 * @version 2.0.0
 * @author mrcode2008
 * @since 2.0.0
 */

/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require('../../config.json');

// Initialize LeeksLazyLogger

const Logger = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

module.exports = {
	name: 'guildCreate',

	/**
	 * @description Executes when bot is invited to a new guild (server).
	 * @param {import('discord.js').Guild & { client: import('../../typings').Client }} guild
	 */

	async execute(guild) {
		// Check Guild Count.
		var guildCount = guild.client.guilds.cache.size;

		// Disallow more than one guild.

		if (guildCount > 1) {
			console.log(
				'\n ---------------------------------------------------------- \n',
			);
			log.notice('BOT CAN JOIN ONLY 1 SERVER TO WORK PROPERLY!');
			log.warn(
				'[Automatic Server Detection] Make sure to make your bot private, so only you can add it in your desired server.',
			);
			guild.leave();
			log.error(`BOT LEFT ${guild.name} AUTOMATICALLY!`);
			console.log(
				'\n ---------------------------------------------------------- \n',
			);
		}

		// Disallow incorrect guild as per configuration.

		if (config.settings.chat_channel != guild.id) {
			console.log(
				'\n ---------------------------------------------------------- \n',
			);
			log.notice('BOT IS INVITED TO AN INVALID GUILD!');
			log.warn(
				'[Automatic Server Detection] Make sure to invite your bot to the correct server, or change your server ID in config.json file.',
			);
			guild.leave();
			log.error(`BOT LEFT ${guild.name} AUTOMATICALLY!`);
			console.log(
				'\n ---------------------------------------------------------- \n',
			);
		}
	},
};
