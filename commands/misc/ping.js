/**
 * @file Sample ping command
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
	name: 'ping',

	execute(message, args) {
		message.channel.send({ content: "Pong. Yes I'm alive and working!" });
	},
};
