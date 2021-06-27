const Discord = require("discord.js");
const client = new Discord.Client();

const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });

module.exports = {
	name: "guildCreate",
	async execute(guild, client) {
		var guildCount = client.guilds.cache.size;
		if (guildCount > 1) {
			log.console(
				"\n ---------------------------------------------------------- \n"
			);
			log.notice("BOT CAN JOIN ONLY 1 SERVER TO WORK PROPERLY!");
			log.warn(
				"[Automatic Server Detection] Make sure to make your bot private, so only you can add it in your desired server."
			);
			guild.leave();
			log.error(`BOT LEFT ${guild.name} AUTOMATICALLY!`);
			log.console(
				"\n ---------------------------------------------------------- \n"
			);
		}
	},
};
