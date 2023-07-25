/**
 * @file Sample ping command
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.0.0
 */

/**
 * @type {import('../../typings').LegacyCommand}
 */
module.exports = {
	name: 'ping',

	execute(message) {
		message.channel.send({ content: "Pong. Yes I'm alive and working!" });
	},
};
