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

const internalChanges = [];

function internalCompare(oldObj, newObj, id, type) {
	for (const property in newObj) {
		if (typeof newObj[property] === 'object') {
			if (type === 'user') {
				internalCompare(oldObj[property], newObj[property], id, type);
			} else {
				internalCompare(oldObj[property], newObj[property], id, type);
			}
		} else {
			if (oldObj[property] !== newObj[property]) {
				if (type === 'user') {
					internalChanges.push({
						property: property,
						type: type,
						userId: id,
						name: property,
						newValue: newObj[property],
						oldValue: oldObj[property],
					});
				} else {
					internalChanges.push({
						property: property,
						type: type,
						name: id,
						newValue: newObj[property],
						oldValue: oldObj[property],
					});
				}
			}
		}
	}

	if (internalChanges.length === 0) {
		return null;
	}

	return internalChanges;
}

function objectComparer(oldObj, newObj, type) {
	const changes = [];

	for (let key = 0; key < newObj.length; key++) {
		if (typeof newObj[key] === 'object') {
			let internalType;

			if (type === 'user') {
				internalType = oldObj[key].user_id;
			} else {
				internalType = oldObj[key].name;
			}
			const internalChanges = internalCompare(oldObj[key], newObj[key], internalType, type);

			if (internalChanges === null) {
				continue;
			}

			changes.push(...internalChanges);
		}
	}

	return changes;
}

/**
 * @description Compares two objects and return changes.
 */
module.exports = objectComparer;
