/**
 * @file Slash Command Interaction Handler
 * @author Naman Vrati
 * @since 3.0.0
 * @version 3.2.2
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

const manager = require("../../functions/database");

module.exports = {
	name: "interactionCreate",

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @author Naman Vrati
	 * @param {import('discord.js').CommandInteraction & { client: import('../../typings').Client }} interaction The interaction which was created
	 */

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a command (to prevent weird bugs)

		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		// If the interaction is not a command in cache.

		if (!command) return;

		// If the command is an owner only command.

		if (
			command.ownerOnly &&
			interaction.user.id !== manager.getConfigFile().internal.owner_id
		) {
			// Send Error

			await interaction.reply({
				content: "You are not authorized to run this interaction!",
				ephemeral: true,
			});

			// And close the interaction.

			return;
		}

		// A try to executes the interaction.

		try {
			await command.execute(interaction);
		} catch (err) {
			log.error(err);
			await interaction.reply({
				content: "There was an issue while executing that command!",
				ephemeral: true,
			});
		}
	},
};
