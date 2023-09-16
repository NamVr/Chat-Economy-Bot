/**
 * @file JSON Database Manager
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.1.0
 */

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

const fs = require('fs');
const util = require('util');
const Discord = require('discord.js');
const client = require('../../functions/client');
const objectComparer = require('../get/object-comparer');

const shopPath = './database/shop.json';
const userPath = './database/users.json';
const configPath = './config.json';

/**
 * Method to fetch the live shop database.
 * @returns {import('../../typings').ShopDatabase} The Shop Database.
 */
function getShopDB() {
	// Read the required database file.

	try {
		var jsonString = fs.readFileSync(shopPath, {
			encoding: 'utf-8',
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
			encoding: 'utf-8',
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
			encoding: 'utf-8',
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
 * Sends the designated log (function).
 * @param {import('../../typings').UserDatabase | import('../../typings').ShopDatabase} oldDB Previous Database (fetched).
 * @param {import('../../typings').UserDatabase | import('../../typings').ShopDatabase} newDB New Database (with changes).
 * @param {import('../../typings').LogReasonData} logReasonData The data for this logging.
 */
async function logDatabaseUpdate(oldDB, newDB, logReasonData) {
	// Import config, we will need it.
	const config = getConfigFile();

	// We will log this update only if logging is enabled.

	if (!config.internal.log_channel_id) return;

	// We will check validity of log channel ID.

	const guild = client.guilds.cache.get(config.internal.guild_id);
	const channel = guild.channels.cache.get(config.internal.log_channel_id);

	if (!channel) {
		log.error(
			'Error posting log: Log channel is invalid.\nPlease enter a correct channel ID in config.json file!\n\nAlternatively, you can disable logging completely by deleting entry of "log_channel_id" in config.json!',
		);
		return process.exit(1);
	}

	if (channel.type !== Discord.ChannelType.GuildText) {
		log.error(
			'Error posting log: Log channel is not a text channel.\nPlease enter a valid text channel ID in config.json file!\n\nAlternatively, you can disable logging completely by deleting entry of "log_channel_id" in config.json!',
		);
		return process.exit(1);
	}

	const changes = objectComparer(oldDB, newDB, logReasonData.compareType);

	if (changes == []) return;

	// Log embed creation.

	const logEmbed = new Discord.EmbedBuilder()
		.setAuthor({
			name: `${logReasonData.initiator
				? logReasonData.initiator.username
				: 'System'
				}`,
			iconURL: `${logReasonData.initiator
				? logReasonData.initiator.avatarURL()
				: 'https://cloud.namanvrati.cf/favicon.png'
				}`,
		})
		.setTitle(`${logReasonData.type}`)
		.setColor('Random')
		.setFooter({
			text: `Powered by NamVr Chat Economy`,
		})
		.setTimestamp();

	// If there are comments, add it to description.
	if (logReasonData.comments) {
		logEmbed.setDescription(logReasonData.comments);
	}

	// Add fields according to examples.
	for (const property in changes) {
		const change = changes[property];
		logEmbed.addFields({
			name: `${change.property}`,
			value: `**Now:** ${change.newValue}\n**Was:** ${change.oldValue}`,
		});
	}

	await channel.send({
		embeds: [logEmbed],
	});
	return;
}

// ********************************************************** //

/**
 * Writes a database to local storage.
 * @param {string} path The path of the database.
 * @param {import('../../typings').ShopDatabase | import('../../typings').UserDatabase | import('../../typings').ConfigurationFile} database A database to write.
 * @returns {import('../../typings').ShopDatabase | import('../../typings').UserDatabase | import('../../typings').ConfigurationFile} The database.
 */
function writeDatabase(path, database) {
	try {
		fs.writeFileSync(path, JSON.stringify(database, null, 2), {
			encoding: 'utf-8',
		});
	} catch (err) {
		// IF ERROR BOT WILL BE TERMINATED!

		if (err) {
			log.error('Error writing file:', err);
			return process.exit(1);
		}
	}
	return database;
}

/**
 * Method to write shop database.
 * @param {import('../../typings').ShopDatabase} shopDB The Shop Database.
 * @param {import('../../typings').LogReasonData} logReasonData The data for this logging.
 * @returns {Promise<import("../../typings").ShopDatabase>}
 */
async function putShopDB(shopDB, logReasonData) {
	// We will log this interaction, fetch live shop DB then update logs.

	const oldShopDB = getShopDB();

	await logDatabaseUpdate(oldShopDB, shopDB, logReasonData);

	// Now we will write the config to shop.json

	return new Promise((resolve) => {
		// @ts-ignore
		resolve(writeDatabase(shopPath, shopDB));
	});
}

/**
 * Method to write user database.
 * @param {import('../../typings').UserDatabase} userDB The User Database.
 * @param {import('../../typings').LogReasonData} logReasonData The data for this logging.
 * @returns {Promise<import("../../typings").UserDatabase>}
 */
async function putUserDB(userDB, logReasonData) {
	// We will log this interaction, fetch live shop DB then update logs.

	const oldUserDB = getUserDB();

	await logDatabaseUpdate(oldUserDB, userDB, logReasonData);

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
async function putConfigFile(configFile) {
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
