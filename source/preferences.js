// Initialize the preferences database
tb.private.preferencesDb = new PouchDB("preferences", function () {
	tb.triggerOnPreferencesLoaded();
	tb.private.preferencesLoaded = true;
});

// Returns true if the preferences database is loaded
tb.isPreferencesLoaded = function () {
	return tb.private.preferencesLoaded || false;
};

// Sets the preferencesLoaded to true by default or false if argument is given
tb.setPreferencesLoaded = function (loaded) {
	if (typeof loaded !== "boolean" || loaded === true) {
		tb.private.preferencesLoaded = true;
	} else {
		tb.private.preferencesLoaded = false;
	}
};

// Triggers onPreferencesLoaded
tb.triggerOnPreferencesLoaded = function () {
	$.event.trigger("onPreferencesLoaded");
};

// Calls back when the preferences have been loaded
tb.onPreferencesLoaded = function (callback) {
	$(window).on("onPreferencesLoaded", function () {
		callback();
	});
};

// Returns a copy of the preferences object
tb.getPreferences = function (user, callback) {
	// If no user is specified, set it to default
	if (typeof user === "function") {
		callback = user;
		// TODO: Set this to the current user, not the default
		user = "default";
	}

	// Get the user's preferences
	tb.private.preferencesDb.get(user, function (err, doc) {
		if (!err) {
			callback(doc);
		} else {
			tb.addPreferences();
		}
	});
};

////////// DEBUGGING //////////
tb.addPreferences = function () {
	tb.private.preferencesDb.put({
		"_id": "default",
		"currentShellPath": "packages/trackbox",
		"defaultPage": "albums",
		"defaultLanguage": "en"
	});
};

tb.destroyPreferences = function () {
	PouchDB.destroy('preferences');
};
//////// END DEBUGGING ////////
