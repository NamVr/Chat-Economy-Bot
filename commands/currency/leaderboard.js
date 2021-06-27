// CURRENCY REQUIREMENTS
const Discord = require("discord.js");
const client = new Discord.Client();

const { Op } = require("sequelize");
const { Users, CurrencyShop } = require("../../database/dbObjects");
const currency = new Discord.Collection();
const client = new Discord.Client();

module.exports = {
	name: "leaderboard",
	aliases: "lb",
	description: "Displays the hall of fame!",
	usage: "",
	//permissions: 'SEND_MESSAGES',
	guildOnly: true,
	async execute(message, args) {
		return message.channel.send(
			currency
				.sort((a, b) => b.balance - a.balance)
				.filter((user) => client.users.cache.has(user.user_id))
				.first(10)
				.map(
					(user, position) =>
						`(${position + 1}) ${client.users.cache.get(user.user_id).tag}: ${
							user.balance
						}💰`
				)
				.join("\n"),
			{ code: true }
		);
	},
};
