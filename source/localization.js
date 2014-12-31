// Calls back with a template from a given path with %%localization tags%% replaced with translations
tb.localizeFile = function (path, language, callback) {
	// Check if the language is omitted
	if (!callback && typeof language === "function") {
		callback = language;
		language = null;
	}

	// Read the file
	tb.getFileContents(path, function (template) {
		// Render the template
		callback(tb.localize(template, language));
	});
};

// Returns a template with %%localization tags%% replaced with translations
tb.localize = function (template, language) {
	// Match localization template tags
	var matches = template.match(/%%((?:(?!%%).)+)%%/g);

	// Replace localization template tags with translations
	for (var match in matches) {
		// Get iteration's match
		var key = matches[match];

		// Remove %% tags
		key = key.substring(2, key.length - 2);

		// Fetch the translation
		var translation = tb.getTranslation(key, language);

		// Apply translation to template
		template = template.replace("%%" + key + "%%", translation);
	}

	// Call back with the rendered template
	return template;
};

// Returns the translation of a string of text in a given language
tb.getTranslation = function (key, language) {
	// Set language to default if language parameter is omitted
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

	// Return the translation
	return translation;
};