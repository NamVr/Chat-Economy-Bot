const configPath = "./config.json";
const heatConfigPath = "./database/heat.json";
const fs = require("fs");
const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });

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
	name: "ready",
	once: true,
	execute(client) {
		setInterval(() => {
			// Tries reading required heat file. If it can't read, bot will be terminated, because they are required!
			try {
				fs.readFileSync(heatConfigPath);
			} catch (error) {
				log.error(error);
				return process.exit(1);
			}

			// json string is stored here.
			const jsonString = fs.readFileSync(heatConfigPath);

			try {
				JSON.parse(jsonString);
			} catch (error) {
				log.error(error);
				return process.exit(1);
			}

			// Read successfully done. Now it actually stores data in const.
			const heatConfig = JSON.parse(jsonString);

			if (heatConfig.heat >= config.heatmax) {
				// Heat Event Activated!
				var random = Math.floor(Math.random() * 5);
				if (random == 0) random += 1;
				//const event = require(`../triggers/event${random}`);
				const event = require(`../triggers/event1`);
				let channel = client.channels.cache.get(config.heat_channel);
				channel.messages.fetch({ limit: 1 }).then((messages) => {
					let message = messages.first();
					event.execute(message);
				});
				heatConfig.heat = 0;
				fs.writeFile(
					heatConfigPath,
					JSON.stringify(heatConfig, null, 2),
					(err) => {
						// IF ERROR BOT WILL BE TERMINATED!
						if (err) {
							log.error("Error writing file:", err);
							return process.exit(1);
						}
					}
				);
			}
		}, config.cooldown);
	},
};
