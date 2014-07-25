// Route hash code and sidebar menu to rendering a view.
trackbox.api.router = {};

// Chose a frame to render based on hash tag on the url.
trackbox.api.router.route = function () {
	var pageName = window.location.hash.substring(1);

	if (trackbox.api.theme.page.pages[pageName]) {
		trackbox.api.theme.page.set(pageName);
	} else {
		window.location.hash = "#" + trackbox.api.theme.page.default;
		trackbox.api.router.route();
	}
};