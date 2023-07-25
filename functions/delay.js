/**
 * @file Delay Creator
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.0.0
 */

/**
 * Asynchronous timeout/delay
 * @param {Number} time in ms
 * @returns {Promise<unknown>}
 */
const delay = (time) => {
	return new Promise((res) => setTimeout(res, time).unref());
};

module.exports = delay;
