// Load JSON preferences file.
tb.loadPreferences = function(forceReload) {
if(!tb.private.preferences || forceReload) {
		tb.getJSONFileContents("users/default/preferences.json", function(data) {
			tb.private.preferences = data;
		});
	}
};

tb.preferences = function(){
	return tb.copyJSON(tb.private.preferences);
};
