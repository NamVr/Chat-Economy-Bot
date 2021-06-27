const Discord = require("discord.js");
const client = new Discord.Client();

module.exports = {
	name: "ping",
	//description: 'Ping!',
	//usage: 'put usage here',
	//permissions: 'SEND_MESSAGES',
	//guildOnly: true,
	execute(message, args) {
		message.channel.send("Pong.");
	},
};
