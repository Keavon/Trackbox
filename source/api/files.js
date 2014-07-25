function getFileContents(url, callback) {
	$.ajax({
		'url': url,
		'dataType': "text"
	}).done(callback);
}

function renderTemplate(templatePath, replacements, callback) {
	getFileContents(templatePath, function (template) {
		for (var key in replacements) {
			template = template.replace(new RegExp("%" + key + "%", "g"), replacements[key]);
		}
		callback(template);
	});
}