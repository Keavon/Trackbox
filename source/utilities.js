tb.getFileContents = {};
tb.getFileContents.v1 = function (url, callback) {
	$.ajax({
		"url": url,
		"cache": false,
		"dataType": "text"
	}).done(callback);
};

tb.renderTemplate = {};
tb.renderTemplate.v1 = function (templatePath, replacements, callback) {
	if (!callback && typeof replacements === 'function') {
		callback = replacements;
		replacements = undefined;
	}

	tb.getFileContents.v1(templatePath, function (template) {
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
			var translation = tb.getTranslation.v1(cleanKey);

			// Apply translation to template
			template = template.replace(key, translation);
		}

		// Return value
		callback(template);
	});
};

tb.getTranslation = {};
tb.getTranslation.v1 = function (key, language) {
	// Set language to default if language paramater is omitted
	language = language || tb.defaultLanguage;

	// Get translation from specified language and key
	var translation = tb.localizations[language][key];

	// Check if the fetched translation exists
	if (typeof translation === "undefined") {
		// If it wasn't English, get the English version
		if (language !== "en") {
			translation = tb.localizations.en[key];
		}

		// If an English version doesn't exist, use the key name
		if (typeof translation === "undefined") {
			translation = key;
		}
	}

	// Return value
	return translation;
};