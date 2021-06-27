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
	name: "transfer",
	aliases: "share",
	description: "Share user balance!",
	usage: "<user mention>",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		const currentAmount = currency.getBalance(message.author.id);
		const transferAmount = args.find((arg) => !/<@!?\d+>/g.test(arg));
		const transferTarget = message.mentions.users.first();

		if (!transferAmount || isNaN(transferAmount))
			return message.channel.send(
				`Sorry ${message.author}, that's an invalid amount.`
			);
		if (transferAmount > currentAmount)
			return message.channel.send(
				`Sorry ${message.author}, you only have ${currentAmount}.`
			);
		if (transferAmount <= 0)
			return message.channel.send(
				`Please enter an amount greater than zero, ${message.author}.`
			);

		currency.add(message.author.id, -transferAmount);
		currency.add(transferTarget.id, transferAmount);

		return message.channel.send(
			`Successfully transferred ${transferAmount}💰 to ${
				transferTarget.tag
			}. Your current balance is ${currency.getBalance(message.author.id)}💰`
		);
	},
};
