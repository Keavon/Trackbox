// Clones an object for when it is necessary to not pass by reference
// http://stackoverflow.com/a/728694/775283
tb.cloneObject = function (originalObject) {
	var copy;

	// Handle the 3 simple types, and null or undefined
	if (null === originalObject || "object" !== typeof originalObject) {
		return originalObject;
	}

	// Handle Date
	if (originalObject instanceof Date) {
		copy = new Date();
		copy.setTime(originalObject.getTime());
		return copy;
	}

	// Handle Array
	if (originalObject instanceof Array) {
		copy = [];
		for (var i = 0, len = originalObject.length; i < len; i++) {
			copy[i] = tb.cloneObject(originalObject[i]);
		}
		return copy;
	}

	// Handle Object
	if (originalObject instanceof Object) {
		copy = {};
		for (var attr in originalObject) {
			if (originalObject.hasOwnProperty(attr)) {
				copy[attr] = tb.cloneObject(originalObject[attr]);
			}
		}
		return copy;
	}

	throw new Error("Unable to clone object! Its type isn't supported.");
};
