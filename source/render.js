// Renders a file's templating and localization
tb.renderFile = function (path, replacements, language, callback) {
	// Validate that the path is a string
	if (typeof path !== "string") {
		console.error("Template file can't be rendered because the given file path is not a string.");
		return null;
	}

	// Determine type for variable overloading
	if (typeof replacements === "function") {
		// Replacements and language omitted
		callback = replacements;
		replacements = null;
		language = null;
	} else if (typeof language === "function") {
		// One argument omitted
		callback = language;

		if (typeof replacements === "object" && replacements !== null) {
			// Replacements given and language omitted
			language = null;
		} else if (typeof replacements === "string") {
			// Replacements omitted and language given
			language = replacements;
			replacements = null;
		} else {
			console.error("Template file can't be rendered because of incorrect arguments.");
			return null;
		}
	}

	// Read the file
	tb.getFileContents(path, function (template) {
		// Render the template
		callback(tb.localize(template, language));
	});
};

// Renders a template's templating and localization
tb.render = function (template, replacements, language) {
	// Validate that template is a string
	if (typeof template !== "string") {
		console.error("Template can't be rendered because the given template is not a string.");
		return null;
	}

	// Replacements and language given
	if (typeof replacements === "object" && replacements !== null && typeof language === "string") {
		template = tb.localize(template, language);
		template = tb.template(template, replacements);
		return template;
	}

	// Replacements omitted and language given
	if (typeof replacements === "string" && typeof language !== "string") {
		language = replacements;

		template = tb.localize(template, language);
		return template;
	}

	// Replacements given and language omitted
	if (typeof replacements === "object" && replacements !== null) {
		template = tb.localize(template);
		template = tb.template(template, replacements);
		return template;
	}

	// Replacements and language omitted
	if (typeof replacements !== "object" && language !== "string") {
		template = tb.localize(template);
		return template;
	}
};