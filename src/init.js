// Initializes the Trackbox Interface
$(document).ready(function () {
	init();
});

// Initalizes Trackbox.
function init() {
	trackbox.api.internal.theme.shell.render();
	trackbox.api.internal.localization.load();
	//trackbox.api.internal.theme.page.load();
	trackbox.api.internal.router.route();
}