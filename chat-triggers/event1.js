const Discord = require("discord.js");
const random = require("../functions/get/random-number");

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: "Event Name",
	execute(message) {
		// Generating 2 random numbers for the event!
		var num1 = random(0, 50);
		var num2 = random(0, 50);

		// Generating a subtraction or addition choice!
		// 1 means addition event, 2 means subtraction event.
		var choice = random(1, 2);

		// Declaring an answer variable!
		let answer = 0;

		choice == 1 ? (answer = num1 + num2) : (answer = num1 - num2);

		// Send your question to the chat.

		message.channel.send({
			embeds: [
				new Discord.MessageEmbed()
					.setColor(`RANDOM`)
					.setTitle(`What is ${num1} ${choice == 1 ? "+" : "-"} ${num2}?`)
					.setFooter({
						text: "Be the first one to say the answer to earn some coins for the shop!",
					}),
			],
		});

		// Create a chat filter & collector.

		const filter = (m) => m.content.toLowerCase() == answer.toString();
		const collector = message.channel.createMessageCollector({
			filter,
			time: 30000,
		});

		// When the answer has been answered, call off the collector on first answer.

		collector.on("collect", () => {
			collector.stop();
		});

		// Execute the rest of the code when the collector has been stopped.

		collector.on("end", (m) => {
			message.channel.send(`${m.last().author.username} won!`);
			return;
		});
	},
};
