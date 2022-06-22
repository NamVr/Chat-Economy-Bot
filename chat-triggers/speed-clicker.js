/**
 * @file Speed Clicker Event
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

const Discord = require("discord.js");

const random = require("../functions/get/random-number");
const manager = require("../functions/database");
const ChatWin = require("../messages/embeds/chat-win");

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: "Speed Clicker",
	enabled: manager.getConfigFile().modules.speed_clicker,
	async execute(message) {
		// Send your question to the chat.

		const msg = await message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(this.name + "!")
					.setDescription(
						"There’s one button below the message, the first person to react wins!"
					)
					.setFooter({
						text: "Be the first one to say the answer to earn some coins for the shop!",
					}),
			],
			components: [
				new Discord.MessageActionRow().addComponents(
					new Discord.MessageButton()
						.setCustomId("event-clicker")
						.setLabel("Speed Click!")
						.setStyle("PRIMARY")
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

		msg
			.awaitMessageComponent({
				filter,
				componentType: "BUTTON",
				time: 30000,
			})
			.catch((err) => {})
			.then((m) => {
				// Disable the button first.

				msg.edit({
					components: [
						new Discord.MessageActionRow().addComponents(
							new Discord.MessageButton()
								.setCustomId("event-clicker")
								.setLabel("Speed Click!")
								.setStyle("SUCCESS")
								.setDisabled(true)
						),
					],
				});

				if (!m) return;

				// Fetch user database and config file.

				const userDB = manager.getUserDB();
				const config = manager.getConfigFile();

				// Find the winner user in the database.

				let user = userDB.find((f) => f.user_id == m.user.id);

				// If the winner user is new (doesn't exists yet)

				if (!user) {
					// @ts-ignore Non-existent object, created for the sake of properties!
					user = {
						user_id: m.user.id,
						balance: 0,
						won_times: 0,
						items: {},
					};
				}

				// Get random coins for the winner.

				const coins = random(config.settings.win_min, config.settings.win_max);

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
