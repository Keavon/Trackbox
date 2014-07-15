// Route hash code and sidebar menu to rendering a view.
trackbox.api.internal.router = {};

// Chose a frame to render based on hash tag on the url.
trackbox.api.internal.router.route = function() {
	trackbox.api.internal.router.selectFrame(window.location.hash);
};

// Select and render the proper frame
trackbox.api.internal.router.selectFrame = function(frameName) {
	if(trackbox.api.internal.theme.frame.exists(frameName) {
		trackbox.api.internal.theme.frame.render(frameName);
	} else {
		trackbox.api.internal.theme.render(trackbox.api.internal.theme.frame.default);
	}
};