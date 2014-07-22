// Route hash code and sidebar menu to rendering a view.
trackbox.api.internal.router = {};

// Chose a frame to render based on hash tag on the url.
trackbox.api.internal.router.route = function(){
	var pageName = window.location.hash.substring(1);

	if (trackbox.api.internal.theme.page.pages[pageName]) {
		trackbox.api.internal.theme.page.set(pageName);
	} else {
		window.location.hash = "#" + trackbox.api.internal.theme.page.default;
		trackbox.api.internal.router.route();
	}
};