// Initializes the Trackbox Interface
$(document).ready(function () {
	init();
	window.onhashchange = trackbox.api.router.route;
});

// Initalizes Trackbox.
function init() {
	trackbox.api.theme.shell.render();
}