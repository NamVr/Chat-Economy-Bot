/**
 * @file Buy command.
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.5
 */

// Initialize LeeksLazyLogger

const Logger = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

const manager = require('../../../functions/database');

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Purchase something from the shop.')
		.addStringOption((option) =>
			option
				.setName('item')
				.setDescription(
					'Select your desired item you want to purchase.',
				)
				.setRequired(true)
				.setAutocomplete(true),
		),
	cooldown: 5,

	async execute(interaction) {
		/**
		 * @description The "item" argument
		 */
		const item_name = interaction.options.getString('item', true);

		const shopDB = manager.getShopDB();
		const userDB = manager.getUserDB();

		// Find the user (index) in the database.

		const dbUser = userDB.find((m) => m.user_id == interaction.user.id);

		// Find the shop item (index) in the database.

		const ShopItem = shopDB.find((item) => item.name == item_name);

		if (!ShopItem) {
			// ERROR: Shop Item does not exists, what are you buying?

			await interaction.reply({
				content:
					'This shop item does not exists. What are you trying to buy?',
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
					} balance, which is ${
						ShopItem.price - dbUser.balance
					} short to buy ${ShopItem.name} (${ShopItem.price})!`,
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

		manager.putShopDB(shopDB);
		manager.putUserDB(userDB);

		// Get currency name & emoji.

		const config_currency = manager.getConfigFile().settings.currency;
		const { name, emoji } = config_currency;

		// Make a stylish embed result!

		const embed = new MessageEmbed()
			.setTitle(`Successful Purchase!`)
			.setDescription(
				`You have successfully purchased ${ShopItem.name} for **${ShopItem.price} ${emoji} ${name}**!`,
			)
			.addField(
				'Transcation Details:',
				`Old Balance: ${
					ShopItem.price + dbUser.balance
				} ${emoji}\nNew Balance: ${dbUser.balance} ${emoji}`,
			)
			.setColor('GREEN')
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
		});

		return;
	},
};
