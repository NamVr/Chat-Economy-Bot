/**
 * @file Math Equation Event
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

const Discord = require("discord.js");
const random = require("../functions/get/random-number");
const manager = require("../functions/database");

/**
 * @type {import('../typings').ChatTriggerEvent}
 */
module.exports = {
	name: "Math Equation",
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
					.setTitle(this.name + "!")
					.setDescription(`What is ${num1} ${choice == 1 ? "+" : "-"} ${num2}?`)
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
			// If no one answered the question :(

			if (!m.last()) return;

			// Fetch user database and config file.

			const userDB = manager.getUserDB();
			const config = manager.getConfigFile();

			// Find the winner user in the database.

			let user = userDB.find((f) => f.user_id == m.last().author.id);

			// If the winner user is new (doesn't exists yet)

			if (!user) {
				// @ts-ignore Non-existent object, created for the sake of properties!
				user = {
					user_id: m.last().author.id,
					balance: 0,
					won_times: 0,
					items: {},
				};
			}

			// Get random coins for the winner.

			const coins = random(config.settings.win_min, config.settings.win_max);

			// Add coins to the winner's balance & database.

			user.balance += coins;
			userDB.indexOf(user) != -1
				? (userDB[userDB.indexOf(user)] = user)
				: userDB.push(user);

			manager.putUserDB(userDB);

			// Send output of winning.

			message.channel.send(`${m.last().author.username} won ${coins}!!`);

			return;
		});
	},
};