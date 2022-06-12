/**
 * @file Ready Event File.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.2.2
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

module.exports = {
	name: "ready",
	once: true,

	/**
	 * @description Executes the block of code when client is ready (bot initialization)
	 * @param {import('../../typings').Client} client Main Application Client
	 */
	execute(client) {
		log.success(
			`Ready! Logged in as ${client.user.tag}\n**********************************************************************\n`
		);
	},
};
