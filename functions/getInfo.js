const Discord = require("discord.js");

var methods = {
	user: async function (m, args) {
		if (!args) return;
		var id = args.replace(/\D/g, "");
		try {
			var user = await m.client.users.fetch(id);
		} catch (error) {
			return;
		}
		if (!user) return;
		return user;
	},
};

module.exports = methods;
