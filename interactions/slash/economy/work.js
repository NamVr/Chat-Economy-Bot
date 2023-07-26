/**
 * @file Work command.
 * @author Naman Vrati
 * @since 2.0.5
 * @version 3.0.0
 */

// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const random = require('../../../functions/get/random-number');
const manager = require('../../../functions/database');
const workStrings = require('../../../messages/strings/work.json');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('work')
		.setDescription('Work at your job to earn some money!'),
	cooldown: 60 * 60,

	async execute(interaction) {
		// Get the currency settings from the database.

		const config = manager.getConfigFile();
		const currency = config.settings.currency;
		const workConfig = config.commands.work;

		// Get the user from the database.

		const userDB = manager.getUserDB();

		const user = userDB.find((f) => f.user_id == interaction.user.id);

		// Create a probability of win/loss by 90/10%.

		let amount = 0;

		if (random(0, 9)) {
			// Positive!

			amount = random(workConfig.min, workConfig.max);
		} else {
			// Negative :(

			amount = -(user.balance * (workConfig.wallet_lost / 100)) | 0;
		}

		// Generate the results.

		const embed = new EmbedBuilder();

		if (amount > 0) {
			// Positive Results.

			const job =
				workStrings.positive[
					random(0, workStrings.positive.length - 1)
				];

			embed
				.setColor('Green')
				.setTitle(`Working as ${job[0]}`)
				.setDescription(
					`${job[1].replace(
						'{{amount}}',
						`**${amount} ${currency.name}**`,
					)}`,
				);
		} else {
			// Negative Results.

			const job =
				workStrings.negative[
					random(0, workStrings.negative.length - 1)
				];

			embed
				.setColor('Red')
				.setTitle(`Working as ${job[0]}`)
				.setDescription(
					`${job[1].replace(
						'{{amount}}',
						`**${-amount} ${currency.name}**`,
					)}`,
				);
		}

		// Display the results.

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
