// 1) Load shell
if (tb.private.preferencesLoaded) {
	// Load shell if the preferences are already loaded
	tb.loadShellPackage();
} else {
	// If preferences aren't yet loaded, load shell when preferences load
	tb.onPreferencesLoaded(function () {
		tb.loadShellPackage();
	});
}

// 2) Load packages
tb.onShellPackageLoaded(function () {
	// Get the user preferences
	tb.getPreferences(function (preferences) {
		// Load the default shell
		tb.loadShell(preferences.currentShellPath);

		// Load the remaining packages
		tb.loadPackages();
	});
});

// 3) Bind hash change and open the current page
tb.onPackagesLoaded(function () {
	window.onhashchange = tb.router;
});