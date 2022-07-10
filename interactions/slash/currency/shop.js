/**
 * @file Server shop command.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
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
		.setName('shop')
		.setDescription('Displays the server shop!'),
	cooldown: 5,

	async execute(interaction) {
		const shopDB = manager.getShopDB();

		// Get currency name & emoji.

		const config_currency = manager.getConfigFile().settings.currency;
		const { name, emoji } = config_currency;

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}'s Shop!`)
			.setColor('RANDOM')
			.setDescription(
				`${shopDB
					.map(
						(item) =>
							`${item.name}: ${item.price} ${emoji} ${name}`,
					)
					.join('\n\n')}`,
			)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
