// Initializes the Trackbox Interface
$(document).ready(function () {
	window.onhashchange = 
	init();
});

// Initalizes Trackbox.
function init() {
	trackbox.api.internal.theme.shell.render();
	trackbox.api.internal.theme.page.load();
	trackbox.api.internal.localization.load();
	trackbox.api.internal.router.route();
	trackbox.api.internal.isLoaded = true;
	$("#page-tabs").click(function(){trackbox.api.internal.router.route();});
}