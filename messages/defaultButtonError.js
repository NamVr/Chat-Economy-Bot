/**
 * @file Default Error Message On Error Button Interaction
 * @author Naman Vrati
 * @since 2.0.0
 */

module.exports = {
	/**
	 * @description Executes when the button interaction could not be fetched.
	 * @author Naman Vrati
	 * @param {import("discord.js").ButtonInteraction} interaction The Interaction Object of the command.
	 */

	async execute(interaction) {
		if (interaction.customId.startsWith('event')) return;
		if (interaction.customId.startsWith('trivia_')) return;
		if (interaction.customId.startsWith('economy_')) return;
		await interaction.reply({
			content: 'There was an issue while fetching this button!',
			ephemeral: true,
		});
		return;
	},
};
