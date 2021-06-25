// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "edititem",
	//aliases: 'additem',
	description: "Edit Item in shop!",
	usage: "<Item Name> <Price> <description>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	ownerOnly: true,
	async execute(message, args) {
		const name = args[0];
		const cost = args[1];
		const description = args.slice(2).join(" ");

		const affectedRows = await CurrencyShop.update(
			{ description: description, cost: cost },
			{ where: { name: name } }
		);
		if (affectedRows > 0) {
			return message.reply(`Item ${name} was edited.`);
		}
		return message.reply(`Could not find a tag with name ${name}.`);
	},
};
