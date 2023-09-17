/**
 * @file Math Equation Event
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.1.0
 */

const Discord = require('discord.js');
const random = require('../functions/get/random-number');
const manager = require('../functions/database');
const ChatWin = require('../messages/embeds/chat-win');
const { DatabaseUser } = require('../functions/database/create');
const { LogTypes } = require('../functions/constants');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Math Equation',
	alias: 'math_equation',

	async execute(message) {
		// Generating 2 random numbers for the event!
		var num1 = random(0, 50);
		var num2 = random(0, 50);

		// Generating a subtraction or addition choice!
		// 1 means addition event, 2 means subtraction event.
		var choice = random(1, 2);

		// Declaring an answer variable!
		let answer = 0;

		choice == 1 ? (answer = num1 + num2) : (answer = num1 - num2);

		// Send your question to the chat.

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(this.name + '!')
			.setDescription(
				`What is ${num1} ${choice == 1 ? '+' : '-'} ${num2}?`,
			)
			.setFooter({
				text: 'Be the first one to say the answer to earn some coins for the shop!',
			});

		const msg = await message.channel.send({
			embeds: [embed],
		});

		// Create a chat filter & collector.

		const filter = (m) => m.content.toLowerCase() == answer.toString();
		const collector = message.channel.createMessageCollector({
			filter,
			time: 30000,
		});

		// When the answer has been answered, call off the collector on first answer.

		collector.on('collect', () => {
			collector.stop();
		});

		// Execute the rest of the code when the collector has been stopped.

		collector.on('end', async (m) => {
			// If no one answered the question :(

			if (!m.last()) {
				msg.edit({
					embeds: [
						embed.setDescription(
							`${embed.data.description}\n\n> **Nobody answered in time!** The answer was \`${answer}\`!`,
						),
					],
				});

				return;
			}

			// Edit the embed after the event ends.

			msg.edit({
				embeds: [
					embed.setDescription(
						`${embed.data.description}\n\n> **${
							m.last().author
						} was the first to answer!** The answer was \`${answer}\`!`,
					),
				],
			});

			// Fetch user database and config file.

			const userDB = manager.getUserDB();
			const config = manager.getConfigFile();

			// Find the winner user in the database.

			let user = userDB.find((f) => f.user_id == m.last().author.id);

			// If user is not in database.

			if (!user) user = new DatabaseUser(m.last().author.id);

			// Get random coins for the winner.

			const coins = random(
				config.settings.win_min,
				config.settings.win_max,
			);

			// Add coins to the winner's balance & database.

			user.balance += coins;
			userDB.indexOf(user) != -1
				? (userDB[userDB.indexOf(user)] = user)
				: userDB.push(user);

			await manager.putUserDB(userDB, {
				type: LogTypes.ChatGameMathEquation,
				initiator: message.author,
			});

			// Send output of winning.

			message.channel.send({
				embeds: [ChatWin(m.last().author, this.name, coins)],
			});

			return;
		});
	},
};
