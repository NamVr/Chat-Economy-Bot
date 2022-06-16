/**
 * @file User Information Extractor
 * @author Naman Vrati
 * @since 1.0.0
 * @version 2.0.0
 */

module.exports = {
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
