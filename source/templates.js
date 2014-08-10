tb.renderTemplate = function (templatePath, replacements, callback) {
	if (!callback && typeof replacements === "function") {
		callback = replacements;
	}

	tb.getFileContents(templatePath, function (template) {
		tb.renderTextTemplate(template, replacements, function (data) {
			callback(data);
		});
	});
};

tb.renderTextTemplate = function (template, replacements, callback) {
	if (!callback && typeof replacements === "function") {
		callback = replacements;
		replacements = undefined;
	}

	// If replacements are given, replace custom tempate tags
	if (typeof replacements !== "undefined") {
		var replacement = template.match(/{{((?:(?!}}).)+)}}/g);

		// Replace template tags
		for (var item in replacement) {
			// Get iteration's match
			var replacementsKey = replacement[item];

			// Remove {{ }} tags
			var cleanReplacementKey = replacementsKey.substring(2, replacementsKey.length - 2);

			// Apply replacements to template
			if (cleanReplacementKey in replacements) {
				template = template.replace(replacementsKey, replacements[cleanReplacementKey]);
			}
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