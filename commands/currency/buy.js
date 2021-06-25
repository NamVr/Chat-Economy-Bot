// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

Reflect.defineProperty(currency, "getBalance", {
	/* eslint-disable-next-line func-name-matching */
	value: function getBalance(id) {
		const user = currency.get(id);
		return user ? user.balance : 0;
	},
});

module.exports = {
	name: "buy",
	aliases: "purchase",
	description: "Purchase something from shop!",
	usage: "<item>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		const item = await CurrencyShop.findOne({
			where: { name: { [Op.like]: args } },
		});
		if (!item) return message.channel.send(`That item doesn't exist.`);
		if (item.cost > currency.getBalance(message.author.id)) {
			return message.channel.send(
				`You currently have ${currency.getBalance(
					message.author.id
				)}, but the ${item.name} costs ${item.cost}!`
			);
		}

		const user = await Users.findOne({ where: { user_id: message.author.id } });
		currency.add(message.author.id, -item.cost);
		await user.addItem(item);

		message.channel.send(`You've bought: ${item.name}.`);
	},
};
