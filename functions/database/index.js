/**
 * @file JSON Database Manager
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Initialize LeeksLazyLogger

const Logger = require("leekslazylogger");
// @ts-ignore
const log = new Logger({ keepSilent: true });

const fs = require("fs");
const util = require("util");

const shopPath = "./database/shop.json";
const userPath = "./database/users.json";
const configPath = "./config.json";

/**
 * Method to fetch the live shop database.
 * @returns {import('../../typings').ShopDatabase} The Shop Database.
 */
function getShopDB() {
	// Read the required database file.

	try {
		var jsonString = fs.readFileSync(shopPath, {
			encoding: "utf-8",
		});
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Parse the required database file.

	try {
		/**
		 * @type {import('../../typings').ShopDatabase}
		 */
		var shopDB = JSON.parse(jsonString);
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Return the live database!

	return shopDB;
}

/**
 * Method to fetch the live user database.
 * @returns {import('../../typings').UserDatabase} The User Database.
 */
function getUserDB() {
	// Read the required database file.

	try {
		var jsonString = fs.readFileSync(userPath, {
			encoding: "utf-8",
		});
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Parse the required database file.

	try {
		/**
		 * @type {import('../../typings').UserDatabase}
		 */
		var userDB = JSON.parse(jsonString);
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Return the live database!

	return userDB;
}

/**
 * Method to fetch the live config file.
 * @returns {import('../../typings').ConfigurationFile} The Config File.
 */
function getConfigFile() {
	// Read the required config file.

	try {
		var jsonString = fs.readFileSync(configPath, {
			encoding: "utf-8",
		});
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Parse the required config file.

	try {
		/**
		 * @type {import('../../typings').ConfigurationFile}
		 */
		var config = JSON.parse(jsonString);
	} catch (error) {
		log.error(error);
		return process.exit(1);
	}

	// Return the live file!

	return config;
}

// ********************************************************** //

/**
 * Writes a database to local storage.
 * @param {string} path The path of the database.
 * @param {import('../../typings').ShopDatabase | import('../../typings').UserDatabase | import('../../typings').ConfigurationFile} database A database to write.
 * @returns {import('../../typings').ShopDatabase | import('../../typings').UserDatabase | import('../../typings').ConfigurationFile} The database.
 */
function writeDatabase(path, database) {
	fs.writeFile(path, JSON.stringify(database, null, 2), (err) => {
		// IF ERROR BOT WILL BE TERMINATED!

		if (err) {
			log.error("Error writing file:", err);
			return process.exit(1);
		}
	});

	return database;
}

/**
 * Method to write shop database.
 * @param {import('../../typings').ShopDatabase} shopDB The Shop Database.
 * @returns {Promise<import("../../typings").ShopDatabase>}
 */
function putShopDB(shopDB) {
	// Now we will write the config to shop.json

	return new Promise((resolve) => {
		// @ts-ignore
		resolve(writeDatabase(shopPath, shopDB));
	});
}

/**
 * Method to write user database.
 * @param {import('../../typings').UserDatabase} userDB The User Database.
 * @returns {Promise<import("../../typings").UserDatabase>}
 */
function putUserDB(userDB) {
	// Now we will write the config to users.json

	return new Promise((resolve) => {
		// @ts-ignore
		resolve(writeDatabase(userPath, userDB));
	});
}

/**
 * Method to write config file.
 * @param {import('../../typings').ConfigurationFile} configFile The Config File.
 * @returns {Promise<import("../../typings").ConfigurationFile>}
 */
function putConfigFile(configFile) {
	// Now we will write the config to shop.json

	return new Promise((resolve) => {
		// @ts-ignore
		resolve(writeDatabase(configPath, configFile));
	});
}

/**
 * @description JSON Database Manager
 */
module.exports = {
	getShopDB,
	getUserDB,
	getConfigFile,
	putShopDB,
	putUserDB,
	putConfigFile,
};
