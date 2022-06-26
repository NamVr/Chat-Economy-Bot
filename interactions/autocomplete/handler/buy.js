/**
 * @file Item Suggestion Auto-Complete
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

const manager = require("../../../functions/database");

/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "buy",

	async execute(interaction) {
		const shopDB = manager.getShopDB();

		// Preparation for the autocomplete request.

		const focusedValue = interaction.options.getFocused();

		// Extract choices automatically from the database file.

		const choices = shopDB.map((m) => m.name);

		// Filter choices according to user input.

		const filtered = choices.filter((choice) =>
			// @ts-ignore
			choice.startsWith(focusedValue)
		);

		// Respond the request here.
		await interaction.respond(
			filtered.map((choice) => ({ name: choice, value: choice }))
		);

		return;
	},
};
