// Calls back with the textual contents of a file at a given path
tb.getFileContents = function (path, callback) {
	$.ajax({
		"url": path,
		"cache": false,
		"dataType": "text"
	}).done(callback)
	.fail(function () {
		console.error("Error reading file at '" + path + "'.");
	});
};

// Loads a JSON file via AJAX
tb.getJSONFileContents = function (path, callback) {
	$.ajax({
		"url": path,
		"cache": false,
		"dataType": "json"
	}).done(callback)
	.fail(function () {
		console.error("Error reading or parsing JSON file at '" + path + "'.");
	});
};
