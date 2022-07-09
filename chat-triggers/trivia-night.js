/**
 * @file Trivia Night Event
 * @author Naman Vrati
 * @since 2.0.4
 * @version 2.0.4
 */

const Discord = require('discord.js');
const random = require('../functions/get/random-number');
const manager = require('../functions/database');
const ChatWin = require('../messages/embeds/chat-win');
const JSONResponse = require('../functions/get/json-response');
const arrayShuffler = require('../functions/get/array-shiffler');
const { DatabaseUser } = require('../functions/database/create');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Trivia Night',
	alias: 'trivia_night',

	async execute(message) {
		/**
		 * @type {import('../typings').OpenTDBResponse} Open Trivia Database Response Data.
		 */

		const response = await JSONResponse(
			manager.getConfigFile().apis.opentdb,
		);

		// Decode base64 strings into utf-8 encoding.

		let data = response.results[0];

		for (const prop in data) {
			if (prop == 'incorrect_answers') {
				for (const [index, value] of data.incorrect_answers.entries()) {
					data.incorrect_answers[index] = Buffer.from(
						value,
						'base64',
					).toString();
				}
			} else {
				data[prop] = Buffer.from(data[prop], 'base64').toString();
			}
		}

		// Send your question to the chat.

		const embed = new Discord.MessageEmbed()
			.setColor(`RANDOM`)
			.setTitle(this.name + '!')
			.setDescription(`**${data.question}**`)
			.addField(
				'Difficultly',
				data.difficulty[0].toUpperCase() + data.difficulty.slice(1),
				true,
			)
			.addField('Category', data.category, true)
			.setFooter({
				text: 'You have 10 seconds to answer!',
			});

		// Create button options.

		const optionsRow = new Discord.MessageActionRow();
		const options = [];

		// Add incorect options.

		for (const [index, value] of data.incorrect_answers.entries()) {
			options.push(
				new Discord.MessageButton()
					.setCustomId(`trivia_incorrect_${index}`)
					.setStyle('PRIMARY')
					.setLabel(value),
			);
		}

		// Add the correct option.

		options.push(
			new Discord.MessageButton()
				.setCustomId(`trivia_correct_answer`)
				.setStyle('PRIMARY')
				.setLabel(data.correct_answer),
		);

		/**
		 * Shuffled Options Array
		 * @type {Discord.MessageButton[]}
		 */

		const shuffledOptions = arrayShuffler(options);

		// Add all the options as buttons in the ActionRow.

		optionsRow.addComponents(shuffledOptions);

		// Send the trivia message.

		const msg = await message.channel.send({
			embeds: [embed],
			components: [optionsRow],
		});

		// Create a collector.

		const collector = msg.createMessageComponentCollector({
			componentType: 'BUTTON',
			time: 10000,
		});

		/**
		 * List of disabled users (who have answered incorrectly first time).
		 * @type {string[]}
		 */

		const disabledUsers = [];

		// Whenever a user presses a button, verify answer.

		collector.on('collect', (i) => {
			if (disabledUsers.includes(i.user.id)) {
				// If the user has already answered incorrectly before.

				i.reply({
					ephemeral: true,
					content: 'You have already answered incorrectly!',
				});
			} else if (i.customId == 'trivia_correct_answer') {
				// The answer is correct, stop the collector.

				i.deferUpdate();
				collector.stop();
			} else {
				// Incorrect first time answer, they are added into blacklist.

				disabledUsers.push(i.user.id);
				i.reply({
					ephemeral: true,
					content: 'Aww! Incorrect answer!',
				});
			}
		});

		// Create a new optionsRow with all buttons disabled & highlighted.

		optionsRow.setComponents();

		for (const [index, value] of shuffledOptions.entries()) {
			if (value.customId.startsWith('trivia_incorrect')) {
				optionsRow.addComponents(
					new Discord.MessageButton()
						.setCustomId(`trivia_incorrect_${index}`)
						.setStyle('DANGER')
						.setLabel(value.label)
						.setDisabled(true),
				);
			} else {
				optionsRow.addComponents(
					new Discord.MessageButton()
						.setCustomId(`trivia_correct_answer`)
						.setStyle('SUCCESS')
						.setLabel(value.label)
						.setDisabled(true),
				);
			}
		}

		// Execute the rest of the code when the collector has been stopped.

		collector.on('end', (m) => {
			// If no one answered the question :(

			if (!m.last() || disabledUsers.includes(m.last().user.id)) {
				msg.edit({
					embeds: [
						embed.setDescription(
							`${embed.description}\n\n> **Nobody answered correctly in time!** The answer was \`${data.correct_answer}\`!`,
						),
					],
					components: [optionsRow],
				});

				return;
			}

			// Edit the embed after the event ends.

			msg.edit({
				embeds: [
					embed.setDescription(
						`${embed.description}\n\n> **${
							m.last().user
						} was the first to answer!** The answer was \`${
							data.correct_answer
						}\`!`,
					),
				],
				components: [optionsRow],
			});

			// Fetch user database and config file.

			const userDB = manager.getUserDB();
			const config = manager.getConfigFile();

			// Find the winner user in the database.

			let user = userDB.find((f) => f.user_id == m.last().user.id);

			// If user is not in database.

			if (!user) user = new DatabaseUser(m.last().user.id);

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

			manager.putUserDB(userDB);

			// Send output of winning.

			message.channel.send({
				embeds: [ChatWin(m.last().user, this.name, coins)],
			});

			return;
		});
	},
};
