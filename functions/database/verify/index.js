/**
 * @file Application Startup Database Verification.
 * @author Naman Vrati
 * @since 2.0.3
 * @version 3.1.0
 */

// Initialize LeeksLazyLogger

const { Logger } = require('leekslazylogger');
// @ts-ignore
const log = new Logger({ keepSilent: true });

// Import Database Constants.

const { LogTypes } = require('../../../functions/constants');
const manager = require('../index');
const { DatabaseUser, DatabaseShopItem } = require('../create');

/**
 * Startup Database Verifier
 * @returns {Promise<void>}
 */
module.exports = async () => {
	// Get current databases.

	const shopDB = manager.getShopDB();
	const userDB = manager.getUserDB();

	// Create dummy new items for cross-verification.

	const dummyShopItem = new DatabaseShopItem('name', 10, 'description');
	const dummyUserItem = new DatabaseUser('0123456789');

	// Cross-verify properties from newly updated dummy objects.

	shopDB.forEach((shopItem) => {
		// Loop through all items & merge properties.

		shopItem = { ...dummyShopItem, ...shopItem };

		// Update the item in the shop database (local).

		const actualItem = shopDB.find((f) => f.name == shopItem.name);
		shopDB.indexOf(actualItem) != -1
			? (shopDB[shopDB.indexOf(actualItem)] = shopItem)
			: shopDB.push(shopItem);
	});

	// Write in the database.

	await manager.putShopDB(shopDB, {
		type: LogTypes.SystemUpdate,
		comments: 'System Initialization Update.',
	});

	userDB.forEach((userItem) => {
		// Loop through all items & merge properties.

		userItem = { ...dummyUserItem, ...userItem };

		// Update the item in the user database (local).

		const actualItem = userDB.find((f) => f.user_id == userItem.user_id);
		userDB.indexOf(actualItem) != -1
			? (userDB[userDB.indexOf(actualItem)] = userItem)
			: userDB.push(userItem);
	});

	// Write in the database.

	await manager.putUserDB(userDB, {
		type: LogTypes.SystemUpdate,
		comments: 'System Initialization Update.',
	});

	// Display Success Message & Return.

	log.success('Database Verification Done Successfully!' + '\n');

	return;
};
