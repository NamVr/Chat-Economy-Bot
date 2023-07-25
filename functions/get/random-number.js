/**
 * @file Random Number Generator
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.0.0
 */

/**
 * Generates a random number between a given range (Default 0-100).
 * @returns {Number} The random number.
 */
function randomNumber(min = 0, max = 100) {
	// Find difference between the maximum/minimum values.
	const difference = max - min;

	// Generate a random number.
	let rand = Math.random();

	// Multiply with difference.
	rand = Math.floor(rand * difference);

	// Add minimum value.
	rand = rand + min;

	// Return the number.
	return rand;
}

module.exports = randomNumber;
