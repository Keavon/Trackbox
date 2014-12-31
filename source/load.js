// 1) Load user preferences
tb.loadPreferences();

// 2) Load shell
tb.onPreferencesLoaded(function () {
	tb.loadShellPackage();
});

// 3) Load packages
tb.onShellPackageLoaded(function () {
	// Load the default shell
	tb.loadShell(tb.preferences().currentShellPath);

	// Load the remaining packages
	tb.loadPackages();
});

// 4) Bind hash change and open the current page
tb.onPackagesLoaded(function () {
	window.onhashchange = tb.router;
});