/**
 * @file File Exists Checker
 * @author Naman Vrati
 * @since 2.0.0
 * @version 2.0.0
 */

const fs = require("fs");

/**
 * Checks if a file or directory exists or not.
 * @param {fs.PathLike} path File/Folder path.
 * @returns {Boolean} true/false.
 */
function fileExists(path) {
	try {
		if (fs.existsSync(path)) {
			return true;
		} else {
			return false;
		}
	} catch (err) {
		return false;
	}
}

/**
 * @description File Exists Checker.
 */
module.exports = fileExists;
