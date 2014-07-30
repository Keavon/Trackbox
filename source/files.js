tb.getFileContents = function (path, callback) {
	$.ajax({
		"url": path,
		"cache": false,
		"dataType": "text"
	}).done(callback);
};