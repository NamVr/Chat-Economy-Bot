/**
 * @file Default Embed Message On Chat-Event Win.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

const { MessageEmbed, User } = require('discord.js');
const manager = require('../../functions/database');
const { name, emoji } = manager.getConfigFile().settings.currency;

/**
 * Returns Chat-Event Win Message Embed.
 * @param {User} user The discord user.
 * @param {String} game The chat-event (game) name.
 * @param {Number} amount The amount of currency won.
 * @returns {MessageEmbed} The Embed Object.
 */

const ChatWin = (user, game, amount) => {
	// Create the ChatWin embed.

	const embed = new MessageEmbed()
		.setColor('GREEN')
		.setTitle(`Congratulations, ${user.username}!`)
		.setDescription(
			`You have **won** the ${game}! You have earned **${amount} ${emoji} ${name}**!`,
		);

	// Return the embed.

	return embed;
};

module.exports = ChatWin;
