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

tb.listPackages = {};
tb.listPackages.v1 = function () {
	var packages = ["songs", "albums", "artists", "tags", "boxes"];
	return packages;
};

tb.packageStartup = {};
tb.packageStartup.v1 = function () {
	var packages = tb.listPackages.v1();
	for (var packs in packages) {
		var packPath = "packages/" + packages[packs] + "/startup.js";

		tb.getFileContents.v1(packPath, function (script) {
			script = '<script type="text/javascript">' + script;
			script += '</' + 'script>';
			$("head").append(script);
		});
	}
};

tb.addPageButton = {};
tb.addPageButton.v1 = function (id, displayName, iconLink) {
	tb.getFileContents.v1(iconLink, function (icon) {
		tb.renderTemplate.v1("packages/trackbox/templates/page-button.html", { "ID": id + "-button", "LINK": id, "NAME": displayName, "ICON": icon }, function (template) {
			var buttons = interfacePreferences.trackbox.buttonLayout[0].alignment[1].pageButtons.buttonOrder;
			var value = buttons[id].order;
			var nextLowest;
			var offset;
			var array = [];

			// Fill an array with all the currently loaded buttons in the interface
			var existingButtons = [];
			$("#page-tabs").children().each(function () {
				existingButtons.push(this.id);
			});

			// Turn array of names into array of orders
			for (var name in existingButtons) {
				existingButtons[name] = existingButtons[name].substring(0, existingButtons[name].length - 7);
				array.push(buttons[existingButtons[name]].order);
			}

			// Find the highest value that is lower than the given value
			for (var item in array) {
				if (array[item] < value) {
					if (typeof offset === "undefined" || value - array[item] < offset) {
						offset = value - array[item];
						nextLowest = array[item];
					}
				}
			}

			// Apply to the top if first or after the appropriate sibling
			if (typeof nextLowest === "undefined") {
				$("#page-tabs").prepend(template);
			} else {
				var afterElement;
				for (var next in buttons) {
					if (buttons[next].order === nextLowest) {
						afterElement = next;
					}
				}
				$("#" + afterElement + "-button").after(template);
			}
		});
	});
};

var pageButtonSelectedAdd = "";
var pageButtonSelectedRemove = "";
var pageButtonSelected = "";

tb.selectPageButton = {};
tb.selectPageButton.v1 = function (id) {
	if (pageButtonSelectedAdd === "" && pageButtonSelectedRemove === "") {
		tb.getFileContents.v1("packages/trackbox/templates/page-button-selected.html", function (text) {
			text = text.split('\n');
			pageButtonSelectedAdd = text[0];
			pageButtonSelectedRemove = text[1];
			tb.selectPageButton.v1(id);
		});
	} else {
		$("#" + pageButtonSelected + "-button").addClass(pageButtonSelectedRemove);
		$("#" + pageButtonSelected + "-button").removeClass(pageButtonSelectedAdd);
		pageButtonSelected = id;
		$("#" + id + "-button").addClass(pageButtonSelectedAdd);
		$("#" + id + "-button").removeClass(pageButtonSelectedRemove);
	}
};

var music = new Audio();
tb.loadTrack = {};
tb.loadTrack.v1 = function (path, autoPlay) {
	if (typeof path === "string") {
		music.src = path;
		if (autoPlay === true) {
			music.play();
		}
	}
};

tb.metadataLoaded = {};
tb.metadataLoaded.v1 = function(callback){
	music.addEventListener('loadedmetadata', function () {
		callback();
	});
};

tb.playbackState = {};
tb.playbackState.v1 = function (action) {
	if (typeof action === "undefined") {
		if (music.paused) {
			return "paused";
		} else {
			return "playing";
		}
	} else {
		if (action === "play") {
			music.play();
		} else if (action === "pause") {
			music.pause();
		} else if (action === "toggle") {
			if (music.paused) {
				music.play();
			} else {
				music.pause();
			}
		}
	}
};

tb.playbackStateChange = {};
tb.playbackStateChange.v1 = function (callback) {
	$(music).on("pause", function () {
		callback("pause");
	});
	$(music).on("play", function () {
		callback("play");
	});
};

tb.trackTime = {};
tb.trackTime.v1 = function (time) {
	if (typeof time !== "undefined") {
		music.currentTime = time;
	} else {
		return music.currentTime;
	}
};

tb.getTrackDuration = {};
tb.getTrackDuration.v1 = function () {
	return music.duration;
};

tb.trackEnded = {};
tb.trackEnded.v1 = function (callback) {
	music.addEventListener("ended", callback());
};