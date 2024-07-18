/**
 * @file Unscramble The Word Event
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.1.0
 */

// Read necessary modules

const Discord = require('discord.js');

const manager = require('../functions/database');
const randomNumber = require('../functions/get/random-number');
const JSONResponse = require('../functions/get/json-response');
const stringShuffler = require('../functions/get/string-shuffler');
const ChatWin = require('../messages/embeds/chat-win');
const { DatabaseUser } = require('../functions/database/create');
const { LogTypes } = require('../functions/constants');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Unscramble The Word',
	alias: 'unscramble_the_word',

	async execute(message) {
		/**
		 * @type {import('../typings').WordnikResponse} Wordnik Response Data.
		 */

		const response = await JSONResponse(
			manager.getConfigFile().apis.wordnik +
				'&hasDictionaryDef=true&minCorpusCount=1000&maxCorpusCount=-1&minDictionaryCount=10&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=1',
		);

		console.log(response);

		/**
		 * @description The Actual Word & Answer.
		 */
		const answer = response[0].word.toLowerCase();

		/**
		 * @type {string}
		 * @description The Random Word (Scrambled).
		 */

		const word = stringShuffler(answer);

		// Send your question to the chat.

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(this.name + '!')
			.setDescription(
				`I have scrambled a word, unscramble it to win some coins!\n\n> \`${word}\``,
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

			const coins = randomNumber(
				config.settings.win_min,
				config.settings.win_max,
			);

			// Add coins to the winner's balance & database.

			user.balance += coins;
			userDB.indexOf(user) != -1
				? (userDB[userDB.indexOf(user)] = user)
				: userDB.push(user);

			await manager.putUserDB(userDB, {
				type: LogTypes.ChatGameUnscrambleTheWord,
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
