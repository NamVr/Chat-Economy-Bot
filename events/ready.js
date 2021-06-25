const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });
const Sequelize = require("sequelize");
const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "./database/database.sqlite",
});
const Users = require("../database/models/Users")(
	sequelize,
	Sequelize.DataTypes
);
const CurrencyShop = require("../database/models/CurrencyShop")(
	sequelize,
	Sequelize.DataTypes
);
const UserItems = require("../database/models/UserItems")(
	sequelize,
	Sequelize.DataTypes
);

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		log.info(`Ready! Logged in as ${client.user.tag}`);
		const storedBalances = await Users.findAll();
		storedBalances.forEach((b) => currency.set(b.user_id, b));
	},
};
