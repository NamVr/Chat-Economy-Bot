/**
 * @file Slash Command Interaction Handler
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.0.0
 */

const Discord = require('discord.js');

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

const manager = require('../../functions/database');
const { DatabaseUser } = require('../../functions/database/create');
const { EmbedBuilder, Collection } = require('discord.js');

module.exports = {
	name: Discord.Events.InteractionCreate,

	/**
	 * @description Executes when an interaction is created and handle it.
	 * @author Naman Vrati
	 * @param {import('discord.js').ChatInputCommandInteraction & { client: import('../../typings').Client }} interaction The interaction which was created
	 */

	async execute(interaction) {
		// Deconstructed client from interaction object.

		const { client } = interaction;

		// Fetch the live configuration file (config.json) & User Database.

		const config = manager.getConfigFile();
		const userDB = manager.getUserDB();

		// Checks if the interaction is a command (to prevent weird bugs)

		if (!interaction.isCommand()) return;

		const command = client.slashCommands.get(interaction.commandName);

		// If the interaction is not a command in cache.

		if (!command) return;

		// If the command is an owner only command.

		if (
			command.ownerOnly &&
			interaction.user.id !== config.internal.owner_id
		) {
			// Send Error

			await interaction.reply({
				content: 'You are not authorized to run this interaction!',
				ephemeral: true,
			});

			// And close the interaction.

			return;
		}

		// If the command is ran outside the economy bot channel, and they are not the owner.

		if (
			interaction.channelId !== config.settings.bot_channel &&
			interaction.user.id !== config.internal.owner_id
		) {
			// Send Error

			await interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle(`:x: Access Denied!`)
						.setDescription(
							`You can't execute economy commands here! We have a special channel => <#${config.settings.bot_channel}>!`,
						)
						.setColor('Red'),
				],
				ephemeral: true,
			});

			// And close the interaction.

			return;
		}

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				return interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle(`:x: Spam is never cool, dude.`)
							.setColor('Red')
							.setDescription(
								`Please wait, you can reuse the \`${
									command.data.name
								}\` command <t:${
									(expirationTime / 1000) | 0
								}:R>.`,
							),
					],
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(
			() => timestamps.delete(interaction.user.id),
			cooldownAmount,
		);

		// Check if the user is registered or not, and register if possible.

		let dbUser = userDB.find((f) => f.user_id == interaction.user.id);

		if (!dbUser) {
			// Create a new DatabaseUser & push the user into it.

			dbUser = new DatabaseUser(interaction.user.id);
			userDB.push(dbUser);

			// Register in the database.
			await manager.putUserDB(userDB);
		}

		// A try to execute the interaction.

		try {
			await command.execute(interaction);
		} catch (err) {
			log.error(err);
			await interaction.reply({
				content: 'There was an issue while executing that command!',
				ephemeral: true,
			});
		}
	},
};
