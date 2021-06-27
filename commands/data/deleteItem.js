// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const client = new Discord.Client();

const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "deleteitem",
	//aliases: 'additem',
	description: "Delete an item from the shop!",
	usage: "<Item Name>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	ownerOnly: true,
	async execute(message, args) {
		const name = args[0];

		const rowCount = await CurrencyShop.destroy({ where: { name: name } });
		if (!rowCount) return message.reply("That item did not exist.");

		return message.reply("Item deleted.");
	},
};
