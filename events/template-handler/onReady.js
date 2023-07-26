/**
 * @file Ready Event File.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.0.0
 */

const Discord = require('discord.js');

/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require('../../config.json');

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

module.exports = {
	name: Discord.Events.ClientReady,
	once: true,

	/**
	 * @description Executes the block of code when client is ready (bot initialization)
	 * @param {import('../../typings').Client} client Main Application Client
	 */
	async execute(client) {
		// Database Verification - on each restart!

		require('../../functions/database/verify')();

		// Load all guild members.

		const guild = await client.guilds.fetch(config.internal.guild_id);
		await guild.members.fetch();

		// Application Startup Success Message.

		log.success(
			`Ready! Logged in as ${client.user.tag}\n**********************************************************************\n`,
		);
	},
};
