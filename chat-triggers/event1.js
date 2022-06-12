const Discord = require("discord.js");

var rn = require("random-number");
var random = rn.generator({ integer: true });

module.exports = {
	name: "Event Name",

	/**
	 *
	 * @param {import('discord.js').Message} message
	 */
	execute(message) {
		var num1 = random(0, 50);
		var num2 = random(0, 50);
		var choice = 2;

		if (choice == 1) {
			// Addition Event
			var answer = num1 + num2;
			message.channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(`RANDOM`)
						.setTitle(`What is ${num1} + ${num2}?`)
						.setDescription(
							`Be the first one to say the answer to earn some coins for the shop!`
						),
				],
			});
			const filter = (m) => m.content.toLowerCase() == answer.toString();
			const collector = message.channel.createMessageCollector({
				filter,
				time: 30000,
			});
			// @ts-ignore
			collector.on("collect", (m) => {
				collector.stop();
			});

			// @ts-ignore
			collector.on("end", (m) => {
				return message.channel.send(`${m.last().author.username} won!`);
			});
		} else {
			// Subtraction Event
			var answer = num1 - num2;
			message.channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setColor(`RANDOM`)
						.setTitle(`What is ${num1} - ${num2}?`)
						.setDescription(
							`Be the first one to say the answer to earn some coins for the shop!`
						),
				],
			});
			const filter = (m) => m.content.toLowerCase() == answer.toString();
			const collector = message.channel.createMessageCollector({
				filter,
				time: 30000,
			});
			// @ts-ignore
			collector.on("collect", (m) => {
				collector.stop();
			});

			// @ts-ignore
			collector.on("end", (collected) => {
				return message.channel.send(`${collected.last().author.username} won!`);
			});
		}
	},
};
