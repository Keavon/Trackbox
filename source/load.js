// 1) Load shell
tb.onPreferencesLoaded(function () {
	tb.loadShellPackage();
});

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