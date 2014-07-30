tb.renderTemplate = function (templatePath, replacements, callback) {
	if (!callback && typeof replacements === 'function') {
		callback = replacements;
	}

	tb.getFileContents(templatePath, function (template) {
		tb.renderTextTemplate(template, replacements, function (data) {
			callback(data);
		});
	});
};

tb.renderTextTemplate = function (template, replacements, callback) {
	if (!callback && typeof replacements === 'function') {
		callback = replacements;
		replacements = undefined;
	}

	// If replacements are given, replace custom tempate tags
	if (typeof replacements !== "undefined") {
		for (var replace in replacements) {
			template = template.replace("{{" + replace + "}}", replacements[replace]);
		}
	}

	// Match localization template tags
	var matches = template.match(/%%((?:(?!%%).)+)%%/g);

	// Replace localization template tags with translations
	for (var match in matches) {
		// Get iteration's match
		var key = matches[match];

		// Remove %% tags
		var cleanKey = key.substring(2, key.length - 2);

		// Get translation
		var translation = tb.getTranslation(cleanKey);

		// Apply translation to template
		template = template.replace(key, translation);
	}

	// Return value
	callback(template);
};