/**
 * @file Message Based Commands Handler
 * @author Naman Vrati
 * @since 1.0.0
 * @version 3.2.2
 */

// Declares constants (destructured) to be used in this file.

const Discord = require("discord.js");

/**
 * @type {import('../../typings').ConfigurationFile} Config File.
 */
const config = require("../../config.json");
const { internal } = config;
const { owner_id } = internal;

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });
const fs = require("fs");
const configPath = "./config.json";

// Prefix regex, we will use to match in mention prefix.

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

module.exports = {
	name: "messageCreate",

	/**
	 * @description Executes when a message is created and handle it.
	 * @author Naman Vrati
	 * @param {import("discord.js").Message & { client: import('../../typings').Client}} message The message which was created.
	 */

	async execute(message) {
		// Declares const to be used.

		const { client, guild, channel, content, author } = message;

		try {
			var configString = fs.readFileSync(configPath, { encoding: "utf-8" });
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		try {
			/**
			 * @type {import('../../typings').ConfigurationFile} Config File.
			 */
			var config = JSON.parse(configString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		const prefix = config.settings.prefix;

		// Checks if the bot is mentioned in the message all alone and triggers onMention trigger.
		// You can change the behavior as per your liking at ./messages/onMention.js

		if (
			message.content == `<@${client.user.id}>` ||
			message.content == `<@!${client.user.id}>`
		) {
			require("../../messages/onMention").execute(message);
			return;
		}

		/**
		 * @description Converts prefix to lowercase.
		 * @type {String}
		 */

		const checkPrefix = prefix.toLowerCase();

		/**
		 * @description Regex expression for mention prefix
		 */

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(checkPrefix)})\\s*`
		);

		// Checks if message content in lower case starts with bot's mention.

		if (!prefixRegex.test(content.toLowerCase())) return;

		/**
		 * @description Checks and returned matched prefix, either mention or prefix in config.
		 */

		const [matchedPrefix] = content.toLowerCase().match(prefixRegex);

		/**
		 * @type {String[]}
		 * @description The Message Content of the received message seperated by spaces (' ') in an array, this excludes prefix and command/alias itself.
		 */

		const args = content.slice(matchedPrefix.length).trim().split(/ +/);

		/**
		 * @type {String}
		 * @description Name of the command received from first argument of the args array.
		 */

		const commandName = args.shift().toLowerCase();

		// Check if mesage does not starts with prefix, or message author is bot. If yes, return.

		if (!message.content.startsWith(matchedPrefix) || message.author.bot)
			return;

		/**
		 * @description The message command object.
		 * @type {import('../../typings').LegacyCommand}
		 */

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(cmd) => cmd.aliases && cmd.aliases.includes(commandName)
			);

		// It it's not a command, return :)

		if (!command) return;

		// Owner Only Property, add in your command properties if true.

		if (command.ownerOnly && message.author.id !== owner_id) {
			return message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle(`:x: Access Denied!`)
						.setDescription(
							`You can't run this command! Please refrain from trying.`
						)
						.setColor("RED"),
				],
			});
		}

		// Guild Only Property, add in your command properties if true.

		if (command.guildOnly && message.channel.type === "DM") {
			return message.reply({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle(`:x: Access Denied!`)
						.setDescription(`You can't run this command in DMs!`)
						.setColor("RED"),
				],
			});
		}

		// Check if the command is an event, if yes, disable calling it directly.
		if (message.channel.id !== config.settings.bot_channel) {
			return message.channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle(`:x: Access Denied!`)
						.setDescription(
							`You can't execute economy commands here! We have a special channel => <#${config.settings.bot_channel}>!`
						)
						.setColor("RED"),
				],
			});
		}

		// Author perms property

		if (command.permissions && message.channel.type !== "DM") {
			const authorPerms = message.channel.permissionsFor(message.author);
			if (!authorPerms || !authorPerms.has(command.permissions)) {
				return message.reply({
					embeds: [
						new Discord.MessageEmbed()
							.setTitle(`:x: Access Denied!`)
							.setDescription(
								`You don't have enough permissions to run this command! Try contacting an admin?`
							)
							.setColor("RED"),
					],
				});
			}
		}

		// Args missing

		if (command.args && !args.length) {
			var reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\nThe proper usage would be: \`${config.settings.prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send({
				embeds: [
					new Discord.MessageEmbed()
						.setTitle(`:x: Arguments Error!`)
						.setDescription(reply)
						.setColor("RED"),
				],
			});
		}

		// Cooldowns

		const { cooldowns } = client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Discord.Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(message.author.id)) {
			const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				return message.reply({
					embeds: [
						new Discord.MessageEmbed()
							.setTitle(`:x: Spam is never cool, dude.`)
							.setColor("RED")
							.setDescription(
								`Please wait ${timeLeft.toFixed(
									1
								)} more second(s) before reusing the \`${
									command.name
								}\` command.`
							),
					],
				});
			}
		}

		timestamps.set(message.author.id, now);
		setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

		// Rest your creativity is below.

		// execute the final command. Put everything above this.
		try {
			command.execute(message, args);
		} catch (error) {
			log.error(error);
			message.reply({
				content: "There was an error trying to execute that command!",
			});
		}
	},
};
