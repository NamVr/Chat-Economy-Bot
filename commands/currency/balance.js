// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const client = new Discord.Client();

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
	name: "balance",
	aliases: "bal",
	description: "Show currenct balance!",
	usage: "[user mention]",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	execute(message, args) {
		const target = message.mentions.users.first() || message.author;
		return message.channel.send(
			`${target.tag} has ${currency.getBalance(target.id)}💰`
		);
	},
};
