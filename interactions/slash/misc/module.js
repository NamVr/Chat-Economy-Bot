/**
 * @file Modules command for economy bot.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.0.0
 */

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require('@discordjs/builders');
const { ChannelType } = require('discord-api-types/v10');

const manager = require('../../../functions/database');
const { EmbedBuilder } = require('discord.js');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('module')
		.setDescription(
			'List of all available modules (chat-games) of your server!',
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('toggle')
				.setDescription('Enable/Disable any module.')
				.addStringOption((option) =>
					option
						.setName('module')
						.setDescription('The module you want to toggle.')
						.setRequired(true)
						.addChoices(
							{ name: 'Math Equation', value: 'math_equation' },
							{ name: 'Speed Clicker', value: 'speed_clicker' },
							{ name: 'Speed Typer', value: 'speed_typer' },
							{
								name: 'Unscramble The Word',
								value: 'unscramble_the_word',
							},
							{ name: 'Trivia Night', value: 'trivia_night' },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('info')
				.setDescription('Shows current information about all modules.'),
		),

	ownerOnly: true,
	async execute(interaction) {
		const { options } = interaction;

		// Get Configuration File.

		const config = manager.getConfigFile();

		// Extract the sub-command used.

		const subCommand = options?.getSubcommand();

		// Check if the toggle sub-command was used or not.

		if (subCommand && subCommand == 'toggle') {
			/**
			 * Extract the choice of Module selected.
			 * @type {"math_equation" | "speed_clicker" | "speed_typer" | "unscramble_the_word" | "trivia_night"} The choice.
			 */
			// @ts-ignore
			const value = options.getString('module', true);

			// Get current configuration value for the choice.

			const currentBool = config.modules[value];

			// Toggle the boolean value.

			config.modules[value] = !currentBool;

			// Write data to the config.json file!

			await manager.putConfigFile(config);

			// Success, follow up & return;

			await interaction.reply({
				content: `Value for \`${value}\` is changed from *${currentBool}* to *${!currentBool}*.`,
			});

			return;
		}

		// Check if the info sub-command was used or not.

		if (subCommand && subCommand == 'info') {
			let information = [];

			for (const module in config.modules) {
				information.push(
					`**${module}**: ${config.modules[module] ? '✅' : '❌'}`,
				);
			}

			// Create a stylish embed for check!

			const embed = new EmbedBuilder()
				.setColor('Random')
				.setTitle('Current Module Settings')
				.setDescription(information.join('\n'));

			// Now follow-up after success!

			await interaction.reply({
				embeds: [embed],
				ephemeral: true,
			});

			return;
		}
	},
};
