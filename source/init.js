// Initializes the Trackbox Interface
$(document).ready(function () {
	init();
	window.onhashchange = trackbox.api.internal.router.route;
});

// Initalizes Trackbox.
function init() {
	trackbox.api.internal.theme.shell.render();
	trackbox.api.internal.theme.page.load();
	trackbox.api.internal.localization.load();
	trackbox.api.internal.router.route();
	trackbox.api.internal.isLoaded = true;
}