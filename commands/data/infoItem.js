// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const client = new Discord.Client();

const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "infoitem",
	//aliases: 'additem',
	description: "Get Info about an Item in shop!",
	usage: "<Item Name>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	ownerOnly: true,
	async execute(message, args) {
		const name = args[0];

		const item = await CurrencyShop.findOne({ where: { name: name } });
		if (item) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			item.increment("usage_count");
			return message.channel.send(item.get("description"));
		}
		return message.reply(`Could not find tag: ${tagName}`);
	},
};
