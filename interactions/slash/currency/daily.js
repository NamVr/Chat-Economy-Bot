/**
 * @file Daily command.
 * @author Naman Vrati
 * @since 2.0.1
 * @version 2.0.1
 */

// Initialize LeeksLazyLogger

const Logger = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require('discord.js');
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
	async execute(interaction) {
		const userDB = manager.getUserDB();

		// Get currency name & emoji.

		const config = manager.getConfigFile();
		const config_currency = config.settings.currency;
		const config_command = config.commands.daily;

		// Get the user from the database.

		const dbUser = userDB.find((m) => m.user_id == interaction.user.id);

		// Check if daily is available.

		const currentTimestamp = +new Date();
		const dbTimestamp = dbUser.time_data.daily.last;
		let streak = dbUser.time_data.daily.streak;
		let streakReset = false;

		const embed = new MessageEmbed();

		if (currentTimestamp < dbTimestamp + 24 * 60 * 60 * 1000) {
			// Daily Not Available!

			embed
				.setTitle("You've already claimed your daily!")
				.setColor('RANDOM')
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
			} else {
				// Streak Reset

				// Check if they lost the streak just now or not.

				if (streak == 0) streakReset = false;
				if (streak != 0) streakReset = true;

				streak = 0;
			}
			embed
				.setTitle(`Daily ${config_currency.name}!`)
				.setColor('RANDOM')
				.setDescription(
					`You're given **\`${config_command.amount}\` ${
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

			dbUser.balance += config_command.amount;
			dbUser.time_data.daily.last = currentTimestamp;
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
