// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const client = new Discord.Client();

const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();

var getInfo = require("../../functions/getInfo");

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
	description: "Show current balance!",
	usage: "[user mention]",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		var target = await getInfo.user(message, args[0]);
		if (!target) target = message.author;

		const embed = new Discord.MessageEmbed()
			.setDescription(
				`Participate in chat games/events to earn more coins to buy roles and discord nitro!`
			)
			.setColor("RANDOM");
		if (target.id === message.author.id) {
			embed.setTitle(`You are at ${currency.getBalance(target.id)} coins 💰`);
		} else {
			embed.setTitle(
				`${target.username} is at ${currency.getBalance(target.id)} coins 💰`
			);
		}

		return message.channel.send(embed);
	},
};
