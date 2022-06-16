/**
 * @file Leaderboard command.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");

const userPath = "./database/users.json";
const fs = require("fs");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Displays the hall of fame!"),

	async execute(interaction) {
		const { client } = interaction;
		// Tries reading required database file.

		try {
			var jsonString = fs.readFileSync(userPath, {
				encoding: "utf-8",
			});
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Tries parsing required database file.

		try {
			/**
			 * @type {import('../../../typings').UserDatabase}
			 */
			var userDB = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// Find the user (index) in the database.

		const str = userDB
			.sort((a, b) => b.balance - a.balance)
			.filter((user) => client.users.cache.has(user.user_id))
			.slice(0, 9)
			.map(
				(user, position) =>
					`(${position + 1}) ${client.users.cache.get(user.user_id).tag}: ${
						user.balance
					}💰`
			)
			.join("\n");

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`${interaction.guild.name}'s Leaderboard`)
			.setDescription(str)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
