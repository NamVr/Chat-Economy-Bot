/**
 * @file Context Interaction Handler
 * @author Krish Garg & Naman Vrati
 * @since 1.0.0
 * @version 3.0.0
 */

const Discord = require('discord.js');

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

module.exports = {
	name: Discord.Events.InteractionCreate,

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @author Naman Vrati
	 * @param {import('discord.js').ContextMenuCommandInteraction & { client: import('../../typings').Client }} interaction The interaction which was created
	 */

	execute: async (interaction) => {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a context interaction (to prevent weird bugs)

		if (!interaction.isContextMenuCommand()) return;

		/**********************************************************************/

		// Checks if the interaction target was a user

		if (interaction.isUserContextMenuCommand()) {
			const command = client.contextCommands.get(
				'USER ' + interaction.commandName,
			);

			// A try to execute the interaction.

			try {
				await command.execute(interaction);
				return;
			} catch (err) {
				log.error(err);
				await interaction.reply({
					content:
						'There was an issue while executing that context command!',
					ephemeral: true,
				});
				return;
			}
		}
		// Checks if the interaction target was a user
		else if (interaction.isMessageContextMenuCommand()) {
			const command = client.contextCommands.get(
				'MESSAGE ' + interaction.commandName,
			);

			// A try to execute the interaction.

			try {
				await command.execute(interaction);
				return;
			} catch (err) {
				log.error(err);
				await interaction.reply({
					content:
						'There was an issue while executing that context command!',
					ephemeral: true,
				});
				return;
			}
		}

		// Practically not possible, but we are still caching the bug.
		// Possible Fix is a restart!
		else {
			return log.warn(
				'Something weird happening in context menu. Received a context menu of unknown type.',
			);
		}
	},
};
