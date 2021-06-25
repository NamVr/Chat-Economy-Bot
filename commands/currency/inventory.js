// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

module.exports = {
	name: "inventory",
	aliases: "inv",
	description: "Show currenct inventory!",
	usage: "[user mention]",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		const user = await Users.findOne({ where: { user_id: target.id } });

		if (!user) return message.channel.send("User has nothing in inventory!");
		const items = await user.getItems();

		if (!items.length)
			return message.channel.send(`${target.tag} has nothing!`);
		return message.channel.send(
			`${target.tag} currently has ${items
				.map((i) => `${i.amount} ${i.item.name}`)
				.join(", ")}`
		);
	},
};
