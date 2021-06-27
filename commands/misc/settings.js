const Discord = require("discord.js");
const client = new Discord.Client();

const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });
const fs = require("fs");
const client = new Discord.Client();

const configPath = "./config.json";
try {
	fs.readFileSync(configPath);
} catch (error) {
	log.error(error);
	return process.exit(1);
}
const configString = fs.readFileSync(configPath);
try {
	JSON.parse(configString);
} catch (error) {
	log.error(error);
	return process.exit(1);
}
const config = JSON.parse(configString);

module.exports = {
	name: "settings",
	description: "Change Settings of the bot!",
	usage: "<property> <new value>",
	//ownerOnly: true,
	execute(message, args) {
		const sub = args[0];
		const value = args[1];

		if (!sub) {
			return message.channel.send(
				`List of available properties!`,
				new Discord.MessageEmbed()
					.setTitle("List of All Available Properties!")
					.setColor("ORANGE").setDescription(`
                    1. \`prefix\`: Changes Bot's Prefix. \n
                    2. \`heatmax\`: Maximum Heat on which a random event should be triggered. \n
                    3. \`heat_on_msg\`: Adds this amount of heat at every message sent! \n
                    4. \`cooldown\`: Cooldown between 2 random events, must be in **ms** numeric (1 second = 1000) \n
                    5. \`heat_channel\`: The main general chat channel ID of your server! \n
                    6. \`ecoshop_channel\`: Bot commands channel where people can use bot-related commands.
                `)
			);
		}

		if (!value) {
			return message.channel.send(
				"You need to define property's value as well!"
			);
		}

		switch (sub.toLowerCase()) {
			case "prefix":
				if (value.length > 10)
					return message.channel.send(
						`Prefix can't be more than 10 character length.`
					);
				config.prefix = value;
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Prefix is changed successfully to \`${value}\``
				);
				break;
			case "heatmax":
				if (isNaN(parseInt(value)))
					return message.channel.send("Heat Max must be a number!");
				if (value > 9999)
					return message.channel.send(
						"Heat Max must not be more than 4 digits long!"
					);
				config.heatmax = parseInt(value);
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Heat Max is changed successfully to \`${value}\``
				);
				break;
			case "heat_on_msg":
			case "heatmax":
				if (isNaN(parseInt(value)))
					return message.channel.send("Heat On Msg must be a number!");
				if (value > 99)
					return message.channel.send(
						"Heat On Msg must not be more than 2 digits long!"
					);
				config.heat_on_msg = parseInt(value);
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Heat On Msg is changed successfully to \`${value}\``
				);
				break;
			case "cooldown":
			case "heatmax":
				if (isNaN(parseInt(value)))
					return message.channel.send("Cooldown must be a number!");
				if (value > 60 * 60 * 24 * 1000 || value < 1000 * 30)
					return message.channel.send(
						"Cooldown must be between 30 seconds to 1 day!"
					);
				config.cooldown = parseInt(value);
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Cooldown is changed successfully to \`${value}\`\nHowever, cooldown will be updated on bot restart.`
				);
				break;
			case "heat_channel":
				let heat_channel = message.guild.channels.cache.find(
					(channel) => channel.id === value
				);
				if (!heat_channel)
					return message.channel.send("Channel could not be linked/found.");
				config.heat_channel = value;
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Heat Channel is changed successfully to \`${value}\``
				);
				break;
			case "ecoshop_channel":
				let ecoshop_channel = message.guild.channels.cache.find(
					(channel) => channel.id === value
				);
				if (!ecoshop_channel)
					return message.channel.send("Channel could not be linked/found.");
				config.ecoshop_channel = value;
				fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
					// IF ERROR BOT WILL BE TERMINATED!
					if (err) {
						log.error("Error writing file:", err);
						return process.exit(1);
					}
				});
				return message.channel.send(
					`Eco Shop Channel is changed successfully to \`${value}\``
				);
				break;

			default:
				return message.channel.send(
					`Seems like I can't identify the property you used.`,
					new Discord.MessageEmbed()
						.setTitle("List of All Available Properties!")
						.setColor("ORANGE").setDescription(`
                                    1. \`prefix\`: Changes Bot's Prefix. \n
                                    2. \`heatmax\`: Maximum Heat on which a random event should be triggered. \n
                                    3. \`heat_on_msg\`: Adds this amount of heat at every message sent! \n
                                    4. \`cooldown\`: Cooldown between 2 random events, must be in **ms** numeric (1 second = 1000) \n
                                    5. \`heat_channel\`: The main general chat channel ID of your server! \n
                                    6. \`ecoshop_channel\`: Bot commands channel where people can use bot-related commands.
                                `)
				);
		}
	},
};
