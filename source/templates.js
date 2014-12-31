// Renders the {{template tags}} with given replacements for a given file
tb.templateFile = function (path, replacements, callback) {
	// Read the file
	tb.getFileContents(path, function (template) {
		// Render the template and call back with the result
		callback(tb.template(template, replacements));
	});
};

// Renders the {{template tags}} with given replacements for a given string
tb.template = function (template, replacements) {
	// Match the {{ }} tags
	var replacement = template.match(/{{((?:(?!}}).)+)}}/g);

	// Replace template tags
	for (var item in replacement) {
		// Get this iteration's match
		var replacementsKey = replacement[item];

		// Remove {{ }} tags
		var replacementKeyWithoutTags = replacementsKey.substring(2, replacementsKey.length - 2);

		// Checks if a key is in the given replacements
		if (replacementKeyWithoutTags in replacements) {
			// Replace this match with its corresponding replacement
			template = template.replace(replacementsKey, replacements[replacementKeyWithoutTags]);
		}
	}

	// Return the rendered template
	return template;
};