/**
 * @file Buy command.
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

const shopPath = "./database/shop.json";
const userPath = "./database/users.json";
const fs = require("fs");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("buy")
		.setDescription("Purchase something from the shop.")
		.addStringOption((option) =>
			option
				.setName("item")
				.setDescription("Select your desired item you want to purchase.")
				.setRequired(true)
				.setAutocomplete(true)
		),

	async execute(interaction) {
		/**
		 * @description The "item" argument
		 */
		const item_name = interaction.options.getString("item", true);

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

		let dbUser = userDB.find((m) => m.user_id == interaction.user.id);
		if (!dbUser) {
			// @ts-ignore Non-existent object, created for the sake of properties!
			dbUser = {
				user_id: interaction.user.id,
				balance: 0,
				won_times: 0,
				items: {},
			};
			dbUser.balance = 0;
		}

		// Find the shop item (index) in the database.

		const ShopItem = shopDB.find((item) => item.name == item_name);

		if (!ShopItem) {
			// ERROR: Shop Item does not exists, what are you buying?

			await interaction.reply({
				content: "This shop item does not exists. What are you trying to buy?",
				ephemeral: true,
			});

			return;
		} else if (ShopItem) {
			// Shop Item exists, check user balance and compare.

			if (dbUser.balance < ShopItem.price) {
				// ERROR: Insufficient balance to purchase!

				await interaction.reply({
					content: `You have insufficient balance to purchase this item.\nYou have ${
						dbUser.balance
					} balance, which is ${ShopItem.price - dbUser.balance} short to buy ${
						ShopItem.name
					} (${ShopItem.price})!`,
					ephemeral: true,
				});

				return;
			} else if (dbUser.balance >= ShopItem.price) {
				// Sufficient balance, process the transcation.

				dbUser.balance = dbUser.balance - ShopItem.price;
				if (!dbUser.items[ShopItem.name]) {
					dbUser.items[ShopItem.name] = 0;
				}
				dbUser.items[ShopItem.name] += 1;

				userDB.indexOf(dbUser) != -1
					? (userDB[userDB.indexOf(dbUser)] = dbUser)
					: userDB.push(dbUser);

				// We will reply to this interaction later after confirming the transaction.
			}
		}

		// Now we will write the config to shop.json

		fs.writeFile(shopPath, JSON.stringify(shopDB, null, 2), (err) => {
			// IF ERROR BOT WILL BE TERMINATED!

			if (err) {
				log.error("Error writing file:", err);
				return process.exit(1);
			}
		});

		// Now we will write the config to users.json

		fs.writeFile(userPath, JSON.stringify(userDB, null, 2), (err) => {
			// IF ERROR BOT WILL BE TERMINATED!

			if (err) {
				log.error("Error writing file:", err);
				return process.exit(1);
			}
		});

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`Successful Purchase!`)
			.setDescription(
				`You have successfully purchased ${ShopItem.name} for ${ShopItem.price}!`
			)
			.addField(
				"Transcation Details:",
				`Old Balance: ${ShopItem.price + dbUser.balance}\nNew Balance: ${
					dbUser.balance
				}`
			)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
