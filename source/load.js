// Bind hash change and start application
window.onhashchange = tb.router;

tb.loadPreferences();

tb.onPreferencesLoaded(function() {
	tb.loadShellPackage();
});

tb.onShellPackageLoaded(function() {
	tb.loadShell((tb.preferences()).currentShellPath);
	tb.loadPackages();
});
