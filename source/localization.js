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

	// Return value
	return translation;
};
