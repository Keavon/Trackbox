tb.getFileContents = {};
tb.getFileContents.v1 = function (url, callback) {
	$.ajax({
		'url': url,
		'cache': false,
		'dataType': "text"
	}).done(callback);
};

tb.renderTemplate = {};
tb.renderTemplate.v1 = function (templatePath, replacements, callback) {
	getFileContents(templatePath, function (template) {
		for (var key in replacements) {
			template = template.replace(new RegExp("%" + key + "%", "g"), replacements[key]);
		}
		callback(template);
	});
};