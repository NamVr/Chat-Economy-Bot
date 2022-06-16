/**
 * @file Item manager for economy bot.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Deconstructed the constants we need in this file.

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

const manager = require("../../../functions/database");

/**
 * @type {import('../../../typings').SlashInteractionCommand}
 */
module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("item")
		.setDescription("Manage items for the economy of your server!")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("add")
				.setDescription("Add an item in your server shop.")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("The name of the item.")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("price")
						.setDescription("The price of the item.")
						.setMinValue(10)
						.setMaxValue(100000)
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("description")
						.setDescription("The description of the item.")
						.setRequired(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("delete")
				.setDescription("Delete an item in your server shop.")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("The name of the item to be deleted.")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("info")
				.setDescription("Get information of an item in your server shop.")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("The name of the item to be showed.")
						.setRequired(true)
						.setAutocomplete(true)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("update")
				.setDescription("Update an item in your server shop.")
				.addStringOption((option) =>
					option
						.setName("name")
						.setDescription("The name of the item to be updated.")
						.setRequired(true)
						.setAutocomplete(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("price")
						.setDescription("The new price of the item.")
						.setMinValue(10)
						.setMaxValue(100000)
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("description")
						.setDescription("The new description of the item.")
						.setRequired(true)
				)
		),

	async execute(interaction) {
		const { options } = interaction;

		// Extract the sub-command used.

		const subCommand = options.getSubcommand();

		const shopDB = manager.getShopDB();

		/**
		 * Values fetched via interaction.
		 */
		let values = {};

		// Now we will update the config object with new value

		if (subCommand == "add" || subCommand == "update") {
			// Fetching Interaction Values

			values.name = options.getString("name", true).trim();
			values.price = options.getInteger("price", true);
			values.description = options.getString("description").trim();

			// Finding Item from the database (if exists)

			const ShopItem = shopDB.find((item) => item.name == values.name);

			// If the subcommand is "add"

			if (subCommand == "add") {
				if (ShopItem) {
					// ERROR: Item already exists while using "add" subcommand.

					await interaction.reply({
						ephemeral: true,
						content: "ERROR, the item you are trying to add already exists!",
					});

					return;
				} else {
					// Item does not exists, add the item in database.

					shopDB.push({
						name: values.name,
						description: values.description,
						price: values.price,
					});

					// We will reply at the end to ensure all operations are done.
				}
			} else if (subCommand == "update") {
				if (ShopItem) {
					// Item already exists, update the item in database.

					let index = shopDB.indexOf(ShopItem);
					Object.assign(shopDB.at(index), values);

					// We will reply at the end to ensure all operations are done.
				} else {
					// ERROR: Item does not exists while using "update" subcommand.

					await interaction.reply({
						ephemeral: true,
						content:
							"ERROR, the item you are trying to update does not exists!",
					});

					return;
				}
			}
		}

		if (subCommand == "delete" || subCommand == "info") {
			values.name = options.getString("name").trim();

			const ShopItem = shopDB.find((item) => item.name == values.name);

			if (ShopItem) {
				// Iteam already exists, proceed.

				if (subCommand == "delete") {
					// Delete the item from the database.

					shopDB.splice(shopDB.indexOf(ShopItem), 1);

					// We will reply at the end to ensure all operations are done.
				} else if (subCommand == "info") {
					// Show information of the item from the database.

					await interaction.reply({
						ephemeral: false,
						embeds: [
							new MessageEmbed()
								.setTitle(`${ShopItem.name}`)
								.setDescription(`${ShopItem.description}`)
								.setColor("RANDOM")
								.addField("Price:", `${ShopItem.price}`, true),
						],
					});

					return;
				}
			} else {
				// ERROR: Item does not exists while using "info" or "delete" subcommand.

				await interaction.reply({
					ephemeral: true,
					content: `ERROR, the item ${
						subCommand == "info"
							? "for which you are asking information" // Case: info subcommand.
							: "you want to delete" // Case: delete subcommand.
					} does not exists!`,
				});

				return;
			}
		}

		// Now we will write the config to shop.json

		manager.putShopDB(shopDB);

		// Now follow-up after success!

		await interaction.reply({
			content: `Success! The item ${values.name} has been successfully ${subCommand}ed.`,
			ephemeral: true,
		});

		return;
	},
};
