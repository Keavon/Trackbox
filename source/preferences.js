// Load JSON preferences file with an option to force a reload
tb.loadPreferences = function (forceReload) {
	if (!tb.private.preferences || forceReload) {
		tb.getJSONFileContents("users/default/preferences.json", function (preferences) {
			tb.private.preferences = preferences;
			tb.triggerOnPreferencesLoaded();
		});
	}
};

// Returns a copy of the preferences object
tb.preferences = function () {
	return tb.cloneObject(tb.private.preferences);
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
