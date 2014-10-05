// Load user preferences
tb.loadPreferences();

// Load shell
tb.onPreferencesLoaded(function () {
	tb.loadShellPackage();
});

// Load packages
tb.onShellPackageLoaded(function () {
	tb.loadShell(tb.preferences().currentShellPath);
	tb.loadPackages();
});

// Bind hash change and open current page
tb.onPackagesLoaded(function () {
	window.onhashchange = tb.router;
});