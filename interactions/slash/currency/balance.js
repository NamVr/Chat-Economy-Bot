/**
 * @file Balance check command.
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
		.setName('balance')
		.setDescription('Shows current user balance.')
		.addUserOption((option) =>
			option
				.setName('user')
				.setDescription('To check a balance of a specific user.'),
		),
	cooldown: 5,

	async execute(interaction) {
		/**
		 * @description The "user" argument
		 */
		let user = interaction.options.getUser('user');

		if (!user) {
			user = interaction.user;
		}

		const userDB = manager.getUserDB();

		// Find the user (index) in the database.

		let dbUser = userDB.find((m) => m.user_id == user.id);

		// If the user is not in database.

		if (!dbUser) dbUser = new DatabaseUser(user.id);

		// Get currency name & emoji.

		const config_currency = manager.getConfigFile().settings.currency;
		const { emoji } = config_currency;

		// Make a stylish embed result!

		const embed = new EmbedBuilder()
			.setTitle(`${user.username}'s balance`)
			.setDescription(`**__Bank:__ ${dbUser.balance} ${emoji}**`)
			.setColor('Random')
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
