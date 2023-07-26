/**
 * @file Daily command.
 * @author Naman Vrati
 * @since 2.0.1
 * @version 3.0.0
 */

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const manager = require('../../../functions/database');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('daily')
		.setDescription('Collect your daily income!'),
	cooldown: 5,

	async execute(interaction) {
		const userDB = manager.getUserDB();

		// Get currency name & emoji.

		const config = manager.getConfigFile();
		const config_currency = config.settings.currency;
		const config_command = config.commands.daily;

		/**
		 * The Final Amount to be added in user database.
		 * @description Base Amount + (Streak Bonus * Number of Streak Days)
		 */
		let amountFinal = config_command.amount;

		// Get the user from the database.

		const dbUser = userDB.find((m) => m.user_id == interaction.user.id);

		// Check if daily is available.

		const currentTimestamp = +new Date();
		const dbTimestamp = dbUser.time_data.daily.last;
		let streak = dbUser.time_data.daily.streak;
		let streakReset = false;

		const embed = new EmbedBuilder();

		if (currentTimestamp < dbTimestamp + 24 * 60 * 60 * 1000) {
			// Daily Not Available!

			embed
				.setTitle("You've already claimed your daily!")
				.setColor('Random')
				.setDescription(
					`Your next daily will be available **<t:${
						((dbTimestamp + 24 * 60 * 60 * 1000) / 1000) | 0
					}:R>**.`,
				);
		} else {
			// Daily Available!

			// Check Streak Validity - Whether daily command is used within 24 hours of next reset.

			if (currentTimestamp < dbTimestamp + 2 * 24 * 60 * 60 * 1000) {
				// Streak Available

				if (!streak) {
					streak = 1;
				} else {
					streak += 1;
				}

				// Also add extra streak amount!

				amountFinal += config_command.streak * streak;
			} else {
				// Streak Reset

				// Check if they lost the streak just now or not.

				if (streak == 0) streakReset = false;
				if (streak != 0) streakReset = true;

				streak = 0;
			}
			embed
				.setTitle(`Daily ${config_currency.name}!`)
				.setColor('Random')
				.setDescription(
					`You're given **\`${amountFinal}\` ${
						config_currency.emoji
					} ${
						config_currency.name
					}!**\n\nYou can claim your next daily **<t:${
						((currentTimestamp + 24 * 60 * 60 * 1000) / 1000) | 0
					}:R>**.`,
				);

			if (streakReset) {
				embed.setFooter({
					text: 'You lost your streak, fam!',
				});
			} else {
				embed.setFooter({
					text: `You are now on a ${streak} day streak!`,
				});
			}

			// Update the balance in the database.

			dbUser.balance += amountFinal;
			dbUser.time_data.daily.last = currentTimestamp;
			dbUser.time_data.daily.streak = streak;
			userDB.indexOf(dbUser) != -1
				? (userDB[userDB.indexOf(dbUser)] = dbUser)
				: userDB.push(dbUser);

			manager.putUserDB(userDB);
		}

		// Send confirmation & end the command.

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
