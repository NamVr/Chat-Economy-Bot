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

		let dbUser = userDB.find((m) => m.user_id == interaction.user.id);

		if (!dbUser) {
			// @ts-ignore Non-existent object, created for the sake of properties!
			dbUser = {
				user_id: interaction.user.id,
				balance: 0,
				won_times: 0,
				last_daily: 0,
				items: {},
			};
		}

		// Check if daily is available.

		const currentTimestamp = +new Date();
		const dbTimestamp = dbUser.last_daily;

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
				)
				.setFooter({
					text: 'Enjoying the game?',
				});

			// Update the balance in the database.

			dbUser.balance += config_command.amount;
			dbUser.last_daily = currentTimestamp;
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
