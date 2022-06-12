/**
 * @file Sample button interaction
 * @author Naman Vrati
 * @since 3.0.0
 */

/**
 * @type {import("../../../typings").ButtonInteractionCommand}
 */
module.exports = {
	id: "sample",

	async execute(interaction) {
		await interaction.reply({
			content: "This was a reply from button handler!",
		});
		return;
	},
};
