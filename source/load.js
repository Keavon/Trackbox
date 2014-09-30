// Bind hash change and start application
window.onhashchange = tb.router;
tb.loadShell("Trackbox");

tb.loadPreferences();
tb.loadPackages();

tb.onPreferencesLoaded(function() {
	tb.loadShellPackage();
});
