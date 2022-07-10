/**
 * @file Leaderboard command.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.5
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
		.setName('leaderboard')
		.setDescription('Displays the hall of fame!'),
	cooldown: 5,

	async execute(interaction) {
		const { client } = interaction;

		const userDB = manager.getUserDB();

		// Get currency name & emoji.

		const config_currency = manager.getConfigFile().settings.currency;
		const { emoji } = config_currency;

		// Find the user (index) in the database.

		const str = userDB
			.sort((a, b) => b.balance - a.balance)
			.filter((user) => client.users.cache.has(user.user_id))
			.slice(0, 9)
			.map(
				(user, position) =>
					`(${position + 1}) ${
						client.users.cache.get(user.user_id).tag
					}: ${user.balance} ${emoji}`,
			)
			.join('\n');

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}'s Leaderboard`)
			.setDescription(str)
			.setColor('RANDOM')
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
