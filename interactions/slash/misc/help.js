/**
 * @file Sample help command with slash command.
 * @author Naman Vrati
 * @since 3.0.0
 * @version 3.1.0
 */

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription(
			'List all commands of bot or info about a specific command.',
		)
		.addStringOption((option) =>
			option
				.setName('command')
				.setDescription('The specific command to see the info of.'),
		),

	async execute(interaction) {
		const commands = interaction.client.slashCommands;

		/**
		 * @type {string}
		 * @description The "command" argument
		 */
		let name = interaction.options.getString('command');

		/**
		 * @type {MessageEmbed}
		 * @description Help command's embed
		 */
		const helpEmbed = new MessageEmbed().setColor('RANDOM');

		if (name) {
			name = name.toLowerCase();
			// If a single command has been asked for, send only this command's help.
			// Added in version 3.1.0
			helpEmbed.setTitle(`Help for \`${name}\` command`);
			if (commands.has(name)) {
				const command = commands.get(name).data;
				if (command.description)
					helpEmbed.setDescription(
						command.description + '\n\n**Parameters:**',
					);
			} else {
				helpEmbed
					.setDescription(
						`No slash command with the name \`${name}\` found.`,
					)
					.setColor('YELLOW');
			}
		} else {
			// Give a list of all the commands
			helpEmbed
				.setTitle('List of all my slash commands')
				.setDescription(
					'`' +
						commands
							.map((command) => command.data.name)
							.join('`, `') +
						'`',
				);
		}

		// Replies to the interaction!

		await interaction.reply({
			embeds: [helpEmbed],
		});
	},
};
