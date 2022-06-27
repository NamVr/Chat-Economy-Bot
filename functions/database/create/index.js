/**
 * @file Database Item Constructor
 * @author Naman Vrati
 * @since 2.0.2
 * @version 2.0.2
 */

const Discord = require('discord.js');

/**
 * Database User Class Constructor
 * @type {import('../../../typings').UserItem}
 */
class DatabaseUser {
	/**
	 * @param {Discord.Snowflake} user_id The user ID of the user.
	 */
	constructor(user_id) {
		this.user_id = user_id;
		this.balance = 0;
		this.won_times = 0;
		this.time_data = {
			daily: {
				last: 0,
				streak: 0,
			},
		};
		this.items = {};
	}
}

/**
 * Represents Constructors.
 */
module.exports = { DatabaseUser };
