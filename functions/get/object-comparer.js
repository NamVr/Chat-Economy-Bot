/**
 * @file Object Comparer
 * @author Naman Vrati
 * @since 3.1.0
 * @version 3.1.0
 */

/**
 * Changelog Sub (Specific) Object.
 * @typedef {Object} ChangelogSpecificObject
 * @property {string | number} newValue
 * @property {string | number} oldValue
 */

/**
 * Object Comparison Function
 * @description Each property which has changed is a new object within this database with sub-properties named "oldValue" and "newValue".
 * @param {Object} oldObj Old Object
 * @param {Object} newObj New Object
 * @returns {Object<string, ChangelogSpecificObject>} Changelog Object
 */
function objectComparer(oldObj, newObj) {
	/**
	 * Each property which has changed is a new object within this database with sub-properties named "oldValue" and "newValue".
	 * @type {Object<string, ChangelogSpecificObject>} Changelog Object
	 */
	const changes = {};

	for (const key in newObj) {
		if (newObj.hasOwnProperty(key)) {
			if (oldObj[key] !== newObj[key]) {
				changes[key] = {
					oldValue: oldObj[key],
					newValue: newObj[key],
				};
			}
		}
	}

	return changes;
}

/**
 * @description Compares two objects and return changes.
 */
module.exports = objectComparer;
