// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "shop",
	aliases: "displayshop",
	description: "Displays the shop!",
	usage: "",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		const items = await CurrencyShop.findAll();
		return message.channel.send(
			items.map((item) => `${item.name}: ${item.cost}💰`).join("\n"),
			{ code: true }
		);
	},
};
