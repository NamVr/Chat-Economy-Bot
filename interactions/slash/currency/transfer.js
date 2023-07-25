/**
 * @file Transfer balance command.
 * @author Naman Vrati
 * @since 1.0.0
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
const { DatabaseUser } = require('../../../functions/database/create');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('transfer')
		.setDescription('Shares your user balance.')
		.addUserOption((option) =>
			option
				.setName('user')
				.setRequired(true)
				.setDescription('The user you are trying to send money.'),
		)
		.addIntegerOption((option) =>
			option
				.setName('amount')
				.setRequired(true)
				.setDescription('The total amount you are trying to share.'),
		),
	cooldown: 5,

	async execute(interaction) {
		/**
		 * @description The "user" argument
		 */
		let user = interaction.options.getUser('user', true);

		/**
		 * @description the "amount" argument
		 */
		let amount = interaction.options.getInteger('amount', true);

		if (user.id == interaction.user.id) {
			await interaction.reply({
				content: "You can't transfer money to yourself, idiot.",
				ephemeral: true,
			});

			return;
		}

		const userDB = manager.getUserDB();

		// Find the user (index) in the database.

		const dbUserSender = userDB.find(
			(m) => m.user_id == interaction.user.id,
		);
		let dbUserReceiver = userDB.find((m) => m.user_id == user.id);

		if (!dbUserReceiver) dbUserReceiver = new DatabaseUser(user.id);

		if (amount > dbUserSender.balance) {
			// ERROR: Insufficient balance!

			await interaction.reply({
				content: 'You have insufficient balance to share/transfer!',
			});

			return;
		} else if (amount <= dbUserSender.balance) {
			// Sufficient balance, process the transcation.

			dbUserSender.balance = dbUserSender.balance - amount;
			dbUserReceiver.balance = dbUserReceiver.balance + amount;

			userDB.indexOf(dbUserSender) != -1
				? (userDB[userDB.indexOf(dbUserSender)] = dbUserSender)
				: userDB.push(dbUserSender);

			userDB.indexOf(dbUserReceiver) != -1
				? (userDB[userDB.indexOf(dbUserReceiver)] = dbUserReceiver)
				: userDB.push(dbUserReceiver);

			manager.putUserDB(userDB);

			// Get currency name & emoji.

			const config_currency = manager.getConfigFile().settings.currency;
			const { name, emoji } = config_currency;

			// Make a stylish embed result!

			const embed = new EmbedBuilder()
				.setTitle(`Transfer Successful!`)
				.setColor('Green')
				.setDescription(
					`You have successfully transfered **${amount} ${emoji} ${name}** to ${user}.`,
				)
				.addFields({
					name: 'Transcation Details:',
					value: `Your balance = ${dbUserSender.balance} ${emoji}\n${user.tag}'s balance = ${dbUserReceiver.balance} ${emoji}`,
				})
				.setTimestamp();

			await interaction.reply({
				embeds: [embed],
			});

			return;
		}
	},
};
