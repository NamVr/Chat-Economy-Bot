/**
 * @file Speed Typer Event
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.0.0
 */

// Read necessary modules

const Discord = require('discord.js');

const manager = require('../functions/database');
const randomNumber = require('../functions/get/random-number');
const JSONResponse = require('../functions/get/json-response');
const ChatWin = require('../messages/embeds/chat-win');
const { DatabaseUser } = require('../functions/database/create');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Speed Typer',
	alias: 'speed_typer',

	async execute(message) {
		/**
		 * @type {import('../typings').WordnikResponse} Wordnik Response Data.
		 */

		const response = await JSONResponse(
			manager.getConfigFile().apis.wordnik +
				'minLength=5&maxLength=10&limit=4',
		);

		/**
		 * @description The Actual Text & Answer.
		 */
		const answer = response.map((r) => r.word.toLowerCase()).join(' ');

		/**
		 * @description The Sussyfied Text (Question).
		 */
		const text = answer.split('').join('​');

		// Send your question to the chat.

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(this.name + '!')
			.setDescription(
				`There's one sussy message below, the first person to type it wins!\n\n> \`${text}\``,
			)
			.setFooter({
				text: 'Be the first one to say the answer to earn some coins for the shop!',
			});

		const msg = await message.channel.send({
			embeds: [embed],
		});

		// Create a chat filter & collector.

		const filter = (m) => m.content.toLowerCase() == answer;
		const collector = message.channel.createMessageCollector({
			filter,
			time: 30000,
		});

		// When the answer has been answered, call off the collector on first answer.

		collector.on('collect', () => {
			collector.stop();
		});

		// Execute the rest of the code when the collector has been stopped.

		collector.on('end', (m) => {
			// If no one answered the question :(

			if (!m.last()) {
				msg.edit({
					embeds: [
						embed.setDescription(
							`${embed.data.description}\n\n> **Nobody typed in time!** Was it that difficult?`,
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
						} was the first to type!** GG!`,
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

			const coins = randomNumber(
				config.settings.win_min,
				config.settings.win_max,
			);

			// Add coins to the winner's balance & database.

			user.balance += coins;
			userDB.indexOf(user) != -1
				? (userDB[userDB.indexOf(user)] = user)
				: userDB.push(user);

			manager.putUserDB(userDB);

			// Send output of winning.

			message.channel.send({
				embeds: [ChatWin(m.last().author, this.name, coins)],
			});

			return;
		});
	},
};
