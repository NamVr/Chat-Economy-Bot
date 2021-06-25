var rn = require("random-number");
var random = rn.generator({ integer: true });
const Discord = require("discord.js");

module.exports = {
	name: "event1",
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'SEND_MESSAGES',
	//guildOnly: true,
	execute(message, args) {
		var num1 = random(0, 50);
		var num2 = random(0, 50);
		var choice = random(1, 2);

		if (choice == "1") {
			// Addition Event
			var answer = num1 + num2;
			console.log("Addition => " + answer);
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(`What is ${num1} + ${num2}?`)
					.setDescription(
						`Be the first one to say the answer to earn some coins for the shop!`
					)
			);
			const filter = (m) => m.content.toLowerCase() == answer.toString();
			const collector = message.channel.createMessageCollector(filter, {
				time: 30000,
			});
			collector.on("collect", (m) => {
				collector.stop();
			});

			collector.on("end", (m) => {
				return message.channel.send(`${m.author} won!`);
			});
		} else {
			// Subtraction Event
			var answer = num1 - num2;
			console.log("Subtraction => " + answer);
			message.channel.send(
				new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(`What is ${num1} - ${num2}?`)
					.setDescription(
						`Be the first one to say the answer to earn some coins for the shop!`
					)
			);
			const filter = (m) => m.content.toLowerCase() == answer.toString();
			const collector = message.channel.createMessageCollector(filter, {
				time: 30000,
			});
			collector.on("collect", (m) => {
				collector.stop();
			});

			collector.on("end", (m) => {
				return message.channel.send(`${m.author} won!`);
			});
		}
	},
};
