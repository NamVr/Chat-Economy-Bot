const Discord = require("discord.js");
const client = new Discord.Client();

//const { prefix, owner } = require("../config.json");
const heatConfigPath = "./database/heat.json";
const config = require("../config.json");
const fs = require("fs");
const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });

module.exports = {
	name: "message",
	async execute(message) {
		if (message.author.bot) return;

		// Tries reading required heat file. If it can't read, bot will be terminated, because they are required!
		try {
			var jsonString = fs.readFileSync(heatConfigPath);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		try {
			var heatConfig = JSON.parse(jsonString);
		} catch (error) {
			log.error(error);
			return process.exit(1);
		}

		// On every message sent, heat gets increased as defined in config.json!
		heatConfig.heat += parseInt(config.heat_on_msg);

		// Now it will add heat in config file.
		fs.writeFile(heatConfigPath, JSON.stringify(heatConfig, null, 2), (err) => {
			// IF ERROR BOT WILL BE TERMINATED!
			if (err) {
				log.error("Error writing file:", err);
				return process.exit(1);
			}
		});
	},
};
