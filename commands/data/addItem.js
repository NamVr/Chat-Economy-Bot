// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "additem",
	//aliases: 'additem',
	description: "Add Item in shop!",
	usage: "<Item Name> <Price> <description>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	ownerOnly: true,
	async execute(message, args) {
		const name = args[0];
		const cost = args[1];
		const description = args.slice(2).join(" ");

		try {
			// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
			const item = await CurrencyShop.create({
				name: name,
				cost: cost,
				description: description,
			});
			return message.reply(`Item ${item.name} added.`);
		} catch (e) {
			if (e.name === "SequelizeUniqueConstraintError") {
				return message.reply("That tag already exists.");
			}
			console.log(e);
			return message.reply("Something went wrong with adding a tag.");
		}
	},
};
