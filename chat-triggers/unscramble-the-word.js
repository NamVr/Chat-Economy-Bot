/**
 * @file Unscramble The Word Event
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Read necessary modules

const Discord = require("discord.js");

const manager = require("../functions/database");
const randomNumber = require("../functions/get/random-number");
const JSONResponse = require("../functions/get/json-response");
const stringShuffler = require("../functions/get/string-shuffler");

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: "Unscramble The Word",
	enabled: manager.getConfigFile().modules.unscramble_the_word,
	async execute(message) {
		/**
		 * @type {import('../typings').WordnikResponse} Wordnik Response Data.
		 */

		const response = await JSONResponse(manager.getConfigFile().apis.wordnik);

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

		message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(this.name + "!")
					.setDescription(
						`I have scrambled a word, unscramble it to win some coins!\n\n> \`${word}\``
					)
					.setFooter({
						text: "Be the first one to say the answer to earn some coins for the shop!",
					}),
			],
		});

		// Create a chat filter & collector.

		const filter = (m) => m.content.toLowerCase() == answer.toString();
		const collector = message.channel.createMessageCollector({
			filter,
			time: 30000,
		});

		// When the answer has been answered, call off the collector on first answer.

		collector.on("collect", () => {
			collector.stop();
		});

		// Execute the rest of the code when the collector has been stopped.

		collector.on("end", (m) => {
			// If no one answered the question :(

			if (!m.last()) return;

			// Fetch user database and config file.

			const userDB = manager.getUserDB();
			const config = manager.getConfigFile();

			// Find the winner user in the database.

			let user = userDB.find((f) => f.user_id == m.last().author.id);

			// If the winner user is new (doesn't exists yet)

			if (!user) {
				// @ts-ignore Non-existent object, created for the sake of properties!
				user = {
					user_id: m.last().author.id,
					balance: 0,
					won_times: 0,
					items: {},
				};
			}

			// Get random coins for the winner.

			const coins = randomNumber(
				config.settings.win_min,
				config.settings.win_max
			);

			// Add coins to the winner's balance & database.

			user.balance += coins;
			userDB.indexOf(user) != -1
				? (userDB[userDB.indexOf(user)] = user)
				: userDB.push(user);

			manager.putUserDB(userDB);

			// Send output of winning.

			message.channel.send(`${m.last().author.username} won ${coins}!!`);

			return;
		});
	},
};
