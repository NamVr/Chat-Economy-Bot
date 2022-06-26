/**
 * @file String Shuffler
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

/**
 * String Shuffler.
 * @param {string} string The string to be shuffled.
 * @returns {string} Shuffled String
 */

function stringShuffler(string) {
	// Split the string by each letter and store it in 'a' (array).

	var a = string.split(''),
		n = a.length;

	// Loop till the length of the string, randomize the strings.

	for (var i = n - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var tmp = a[i];
		a[i] = a[j];
		a[j] = tmp;
	}
	return a.join('');
}

/**
 * String Shuffler
 * Credits to https://stackoverflow.com/questions/3943772/how-do-i-shuffle-the-characters-in-a-string-in-javascript
 */
module.exports = stringShuffler;
