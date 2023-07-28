/**
 * @file Currency manager for economy bot.
 * @author Naman Vrati
 * @since 3.1.0
 * @version 3.1.0
 */

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const manager = require('../../../functions/database');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('currency')
		.setDescription('Manage currency for the economy of your server!')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('add')
				.setDescription('Add currency to a user.')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription(
							'The user for which currency will be added.',
						)
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setMinValue(0)
						.setDescription('The amount of currency to be added.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remove')
				.setDescription('Remove currency from a user.')
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription(
							'The user for which currency will be removed.',
						)
						.setRequired(true),
				)
				.addIntegerOption((option) =>
					option
						.setName('amount')
						.setMinValue(0)
						.setDescription('The amount of currency to be removed.')
						.setRequired(true),
				),
		),

	ownerOnly: true,
	async execute(interaction) {
		const { options } = interaction;

		// Extract the sub-command used.

		const subCommand = options.getSubcommand();

		// Get User Database & Config from the Manager.

		const userDB = manager.getUserDB();
		const config = manager.getConfigFile();

		/**
		 * Amount of Currency to be Added/Removed.
		 */
		let amount = options.getInteger('amount', true);

		/**
		 * The user to which currency will be added/removed.
		 */
		let user = options.getUser('user', true);

		// Find the user (index) in the database.

		let dbUser = userDB.find((m) => m.user_id == user.id);

		/**
		 * Store current currency amount to cache.
		 */
		let old_balance = dbUser.balance;

		// Add/Remove balance from cache object.

		if (subCommand == 'add') {
			dbUser.balance += amount;
		}

		if (subCommand == 'remove') {
			dbUser.balance -= amount;

			if (dbUser.balance < 0) dbUser.balance = 0;
		}

		// Now we will write the config to users.json

		userDB.indexOf(dbUser) != -1
			? (userDB[userDB.indexOf(dbUser)] = dbUser)
			: userDB.push(dbUser);

		manager.putUserDB(userDB);

		// Now follow-up after success!

		const embed = new EmbedBuilder()
			.setTitle('Update Successful!')
			.setDescription(
				`You have successfully ${subCommand}ed **${amount} ${config.settings.currency.emoji} ${config.settings.currency.name}** to ${user}.`,
			)
			.setColor('Green')
			.addFields({
				name: 'Transaction Details:',
				value: `${user.username}'s old balance = ${old_balance} ${config.settings.currency.emoji}\n${user.username}'s new balance = ${dbUser.balance} ${config.settings.currency.emoji}`,
			});

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
