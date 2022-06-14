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

const shopPath = "./database/shop.json";

const fs = require("fs");

/**
 * @type {import("../../../typings").AutocompleteInteraction}
 */
module.exports = {
	name: "item",

	async execute(interaction) {
		// Tries reading required database file.

		try {
			var jsonString = fs.readFileSync(shopPath, {
				encoding: "utf-8",
			});
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Tries parsing required database file.

		try {
			/**
			 * @type {import('../../../typings').ShopDatabase}
			 */
			var shopDB = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

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
