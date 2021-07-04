const Discord = require("discord.js");
const client = new Discord.Client();
const ms = require("ms");

const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });
const fs = require("fs");

const configPath = "./config.json";
try {
	var configString = fs.readFileSync(configPath);
} catch (error) {
	log.error(error);
	return process.exit(1);
}

try {
	var config = JSON.parse(configString);
} catch (error) {
	log.error(error);
	return process.exit(1);
}

module.exports = {
	name: "settings",
	description: "Change Settings of the bot!",
	usage: "<property> <new value>",
	//ownerOnly: true,
	async execute(message, args) {
		const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣"];
		const filter = (reaction, user) => {
			return (
				emotes.includes(reaction.emoji.name) && user.id === message.author.id
			);
		};
		const m = await message.channel.send(
			"Message Reaction Controller will expire in 120 seconds.",
			new Discord.MessageEmbed()
				.setColor("RANDOM")
				.setTitle("⚙ Bot Settings")
				.setFooter(
					"If any setting is not working, it means bot requires a restart!"
				)
				.setDescription(
					`List of All Available Properties! React with the respective category to change it's setting.`
				)
				.addField(
					"1️⃣ | Bot Prefix",
					"This is a prefix to which bot responds to someone!"
				)
				.addField(
					"2️⃣ | Maximum Heat",
					"A event will occur in the chat when this amount of heat is reached in chat."
				)
				.addField(
					"3️⃣ | Heat Per Message",
					"I'll add this amount of heat per message in chat channel."
				)
				.addField(
					"4️⃣ | Event Cooldown",
					"Prevents re-occuring of events very quickly. Your cooldown will be minimum gap between two events."
				)
				.addField(
					"5️⃣ | Chat Channel",
					"This is the main channel where chat events function!"
				)
				.addField(
					"6️⃣ | Bot Commands Channel",
					"I will restrict all economy commands in this channel by itself!"
				)
		);
		await m.react("1️⃣");
		await m.react("2️⃣");
		await m.react("3️⃣");
		await m.react("4️⃣");
		await m.react("5️⃣");
		await m.react("6️⃣");

		const collector = m.createReactionCollector(filter, { time: 120000 });

		collector.on("collect", (reaction, user) => {
			async function switchTry(value) {
				switch (value) {
					case "1️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle("What should be the new prefix?")
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = collected.first().content;
								if (value.length > 10)
									return message.channel.send(
										`Prefix can't be more than 10 character length.`
									);
								config.prefix = value;
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Prefix is changed to ${value} successfully!`
								);
							});
						break;

					case "2️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle("What should be new Maximum Heat Value?")
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = collected.first().content;
								if (isNaN(parseInt(value)))
									return message.channel.send("Heat Max must be a number!");
								if (value > 9999 || value < 1)
									return message.channel.send(
										"Heat Max must not be more than 4 digits long!"
									);
								config.heatmax = parseInt(value);
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Heat Max is changed successfully to \`${value}\``
								);
							});
						break;
					case "3️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle("What should be the new heat per message value?")
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = collected.first().content;
								if (isNaN(parseInt(value)))
									return message.channel.send("Heat On Msg must be a number!");
								if (value > 99 || value < 1)
									return message.channel.send(
										"Heat On Msg must not be more than 2 digits long!"
									);
								config.heat_on_msg = parseInt(value);
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Heat On Msg is changed successfully to \`${value}\``
								);
							});
						break;

					case "4️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle(
									"What should be the cooldown? (You can use h, d, etc)"
								)
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = ms(collected.first().content);
								if (isNaN(parseInt(value)))
									return message.channel.send("Cooldown must be a number!");
								if (value > 60 * 60 * 24 * 1000 || value < 1000 * 30)
									return message.channel.send(
										"Cooldown must be between 30 seconds to 1 day!"
									);
								config.cooldown = parseInt(value);
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Cooldown is changed successfully to \`${value}\`\nHowever, cooldown will be updated on bot restart.`
								);
							});
						break;
					case "5️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle("What should be your chat channel?")
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = collected.first().content.replace(/\D/g, "");
								var heat_channel = message.guild.channels.cache.find(
									(c) => c.id === value
								);
								if (!heat_channel)
									return message.channel.send(
										"Channel could not be linked/found."
									);
								config.heat_channel = value;
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Heat Channel is changed successfully to \`${heat_channel}\``
								);
							});
						break;
					case "6️⃣":
						await message.channel.send(
							new Discord.MessageEmbed()
								.setColor("RANDOM")
								.setTitle("What should be the bot commands channel?")
						);
						await message.channel
							.awaitMessages((m) => m.author.id == message.author.id, {
								max: 1,
								time: 30000,
								errors: ["time"],
							})
							.then(async (collected) => {
								var value = collected.first().content.replace(/\D/g, "");
								var ecoshop_channel = message.guild.channels.cache.find(
									(c) => c.id === value
								);
								if (!ecoshop_channel)
									return message.channel.send(
										"Channel could not be linked/found."
									);
								config.ecoshop_channel = value;
								fs.writeFile(
									configPath,
									JSON.stringify(config, null, 2),
									(err) => {
										// IF ERROR BOT WILL BE TERMINATED!
										if (err) {
											log.error("Error writing file:", err);
											return process.exit(1);
										}
									}
								);
								return message.channel.send(
									`Economy Bot Shop Channel is changed successfully to \`${ecoshop_channel}\``
								);
							});
						break;
				}
			}

			switchTry(reaction.emoji.name);
			return collector.stop();
		});

		collector.on("end", (collected) => {
			m.edit("This message is no longer monitoring reactions.");
		});
	},
};
