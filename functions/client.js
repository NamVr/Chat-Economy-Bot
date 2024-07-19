/**
 * @file Client Declaration
 * @author Naman Vrati
 * @since 3.1.0
 * @version 3.1.0
 */

const { Client } = require('discord.js');

/**
 * From v13, specifying the intents is compulsory.
 * @type {import("../typings").Client}
 * @description Main Application Client */

// @ts-ignore
const client = new Client({
	// Please add all intents you need, more detailed information @ https://ziad87.net/intents/
	intents: 45571,
});

// Export client for use anywhere in project.

module.exports = client;
