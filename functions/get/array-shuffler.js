/**
 * @file Array Shuffler
 * @author Naman Vrati
 * @since 2.0.4
 * @version 2.0.4
 */

/**
 * Array Shuffler.
 * @param {Array} array The array to be shuffled.
 * @returns {Array} Shuffled Array
 */

function arrayShuffler(array) {
	let currentIndex = array.length,
		randomIndex;

	// While there remain elements to shuffle.

	while (currentIndex != 0) {
		// Pick a remaining element.

		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.

		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}

	return array;
}

/**
 * Array Shuffler
 * Credits to https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
module.exports = arrayShuffler;
