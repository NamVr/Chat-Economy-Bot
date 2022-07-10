/**
 * @file Beg command.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.5
 */

// Deconstructed the constants we need in this file.

const { MessageEmbed, Collection } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const random = require('../../../functions/get/random-number');
const manager = require('../../../functions/database');
const begStrings = require('../../../messages/strings/beg.json');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('beg')
		.setDescription('Beg a stranger for money!'),
	cooldown: 60 * 60,

	async execute(interaction) {
		// Get the currency settings from the database.

		const config = manager.getConfigFile();
		const currency = config.settings.currency;
		const begConfig = config.commands.beg;

		// Create a probability of win/loss by 75/25%.

		let amount = 0;
		let string = '';

		if (random(0, 3)) {
			// Positive!

			amount = random(begConfig.positive_min, begConfig.positive_max);
			string =
				begStrings.positive[random(0, begStrings.positive.length - 1)];
		} else {
			// Negative :(

			amount = random(begConfig.negative_min, begConfig.negative_max);
			string =
				begStrings.negative[random(0, begStrings.negative.length - 1)];
		}

		// Get the user from the database.

		const userDB = manager.getUserDB();

		const user = userDB.find((f) => f.user_id == interaction.user.id);

		// Display the results.

		const embed = new MessageEmbed()
			.setColor('RANDOM')
			.setTitle(
				begStrings.title_names[
					random(0, begStrings.title_names.length - 1)
				],
			)
			.setDescription(
				string.replace(
					'{{amount}}',
					amount > 0
						? `${amount} ${currency.name}`
						: `${-amount} ${currency.name}`,
				),
			);

		await interaction.reply({
			embeds: [embed],
		});

		// Update the user in the user database.

		user.balance += amount;

		userDB.indexOf(user) != -1
			? (userDB[userDB.indexOf(user)] = user)
			: userDB.push(user);
		manager.putUserDB(userDB);

		// The job is done!

		return;
	},
};
