const Sequelize = require("sequelize");
const Logger = require("leekslazylogger");
const log = new Logger({ keepSilent: true });

const sequelize = new Sequelize("database", "username", "password", {
	host: "localhost",
	dialect: "sqlite",
	logging: false,
	storage: "./database/database.sqlite",
});

require("./models/CurrencyShop")(sequelize, Sequelize.DataTypes);
require("./models/Users")(sequelize, Sequelize.DataTypes);
require("./models/UserItems")(sequelize, Sequelize.DataTypes);

const force = process.argv.includes("--force") || process.argv.includes("-f");

sequelize
	.sync({ force })
	.then(async () => {
		const shop = [
			//CurrencyShop.upsert({ name: 'Cake', cost: 5 }),
		];
		await Promise.all(shop);
		log.info("Database synced!");
		sequelize.close();
	})
	.catch(log.console.error);
