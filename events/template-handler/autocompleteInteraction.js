/**
 * @file Autocomplete request Interaction Handler
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

module.exports = {
	name: "interactionCreate",

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @author Naman Vrati
	 * @param {import('discord.js').AutocompleteInteraction & { client: import('../../typings').Client }} interaction The interaction which was created
	 */

	async execute(interaction) {
		// Deconstructed client from interaction object.
		const { client } = interaction;

		// Checks if the interaction is a request (to prevent weird bugs)

		if (!interaction.isAutocomplete()) return;

		const request = client.autocompleteInteractions.get(
			interaction.commandName
		);

		// If the interaction is not a request in cache.

		if (!request) return;

		// A try to executes the interaction.

		try {
			await request.execute(interaction);
		} catch (err) {
			log.error(err);
		}
	},
};
