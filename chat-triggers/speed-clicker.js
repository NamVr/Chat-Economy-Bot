/**
 * @file Speed Clicker Event
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.0.0
 */

const Discord = require('discord.js');

const random = require('../functions/get/random-number');
const manager = require('../functions/database');
const ChatWin = require('../messages/embeds/chat-win');
const { DatabaseUser } = require('../functions/database/create');

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: 'Speed Clicker',
	alias: 'speed_clicker',

	async execute(message) {
		// Send your question to the chat.

		const embed = new Discord.EmbedBuilder()
			.setColor(`Random`)
			.setTitle(this.name + '!')
			.setDescription(
				'There’s one button below the message, the first person to react wins!',
			)
			.setFooter({
				text: 'Be the first one to click the button to earn some coins for the shop!',
			});

		/**
		 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
		 */
		const actionRow = new Discord.ActionRowBuilder();

		const msg = await message.channel.send({
			embeds: [embed],
			components: [
				actionRow.addComponents(
					new Discord.ButtonBuilder()
						.setCustomId('event-clicker')
						.setLabel('Speed Click!')
						.setStyle(Discord.ButtonStyle.Primary),
				),
			],
		});

		/**
		 * Create a filter for the collector.
		 * @param {Discord.ButtonInteraction} i
		 * @returns {boolean} true
		 */
		const filter = (i) => {
			i.deferUpdate();
			return true;
		};

		// Create a collector.

		msg.awaitMessageComponent({
			filter,
			componentType: Discord.ComponentType.Button,
			time: 30000,
		})
			.catch((err) => {})
			.then((m) => {
				// If no one clicked the button :(

				if (!m) {
					/**
					 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
					 */
					const actionRow = new Discord.ActionRowBuilder();

					msg.edit({
						embeds: [
							embed.setDescription(
								`${embed.data.description}\n\n> **Nobody clicked in time!** It was really simple tho.`,
							),
						],
						components: [
							actionRow.addComponents(
								new Discord.ButtonBuilder()
									.setCustomId('event-clicker')
									.setLabel('Speed Click!')
									.setStyle(Discord.ButtonStyle.Danger)
									.setDisabled(true),
							),
						],
					});

					return;
				}

				// Edit the embed after the event ends.

				/**
				 * @type {Discord.ActionRowBuilder<Discord.ButtonBuilder>}
				 */
				const actionRow = new Discord.ActionRowBuilder();

				msg.edit({
					embeds: [
						embed.setDescription(
							`${embed.data.description}\n\n> **${m.user} was the first to click!** GG!`,
						),
					],
					components: [
						actionRow.addComponents(
							new Discord.ButtonBuilder()
								.setCustomId('event-clicker')
								.setLabel('Speed Click!')
								.setStyle(Discord.ButtonStyle.Success)
								.setDisabled(true),
						),
					],
				});

				// Fetch user database and config file.

				const userDB = manager.getUserDB();
				const config = manager.getConfigFile();

				// Find the winner user in the database.

				let user = userDB.find((f) => f.user_id == m.user.id);

				// If user is not in database.

				if (!user) user = new DatabaseUser(m.user.id);

				// Get random coins for the winner.

				const coins = random(
					config.settings.win_min,
					config.settings.win_max,
				);

				// Add coins to the winner's balance & database.

				user.balance += coins;
				userDB.indexOf(user) != -1
					? (userDB[userDB.indexOf(user)] = user)
					: userDB.push(user);

				manager.putUserDB(userDB);

				// Send output of winning.

				message.channel.send({
					embeds: [ChatWin(m.user, this.name, coins)],
				});

				return;
			});
	},
};
