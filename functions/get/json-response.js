/**
 * @file JSON Response Helper
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

// Extract fetch.

const { fetch } = require('undici');

/**
 * Fetch JSON Response using API Link.
 * @param {string} link The API Link.
 */
async function JSONResponse(link) {
	// Get the response.

	const response = await fetch(link);

	// Convert response into JSON.

	/**
	 * @type {any} Response Data.
	 */
	const data = await response.json();

	return data;
}

/**
 * @description Fetch JSON Response using API Link.
 */
module.exports = JSONResponse;
