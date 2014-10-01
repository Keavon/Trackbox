// Bind hash change and start application
window.onhashchange = tb.router;
tb.loadShell("Trackbox");

tb.loadPreferences();


tb.onPreferencesLoaded(function() {
	tb.loadShellPackage();
});

tb.onShellPackageLoaded(function() {
	tb.loadPackages();
});
