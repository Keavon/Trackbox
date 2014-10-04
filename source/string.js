// Sanatize a string: Remove all non-word special symbols from a string.
tb.sanatizeString = function(stringToSanatize) {
	return stringToSanatize.replace(/[^\w]/gi, '');
};
