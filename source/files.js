// Loads a file via AJAX
tb.getFileContents = function (path, callback) {
	$.ajax({
		"url": path,
		"cache": false,
		"dataType": "text"
	}).done(callback)
	.fail(function () {
		console.error("Error reading file at \'" + path + "\'.");
	});
};

// Loads a json file via AJAX
tb.getJSONFileContents = function (path, callback) {
	$.ajax({
		"url": path,
		"cache": false,
		"dataType": "json"
	}).done(callback)
	.fail(function () {
		console.error("Error parsing JSON file at \'" + path + "\'.");
	});
};
