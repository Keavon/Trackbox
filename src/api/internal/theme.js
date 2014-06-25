// Handles the theming of the interface and frames
trackbox.api.internal.theme = {};

// Choose a default interface to load at startup
trackbox.api.internal.theme.interface = {};
trackbox.api.internal.theme.interface.default = {};
trackbox.api.internal.theme.interface.default.name = "trackbox";
trackbox.api.internal.theme.interface.default.path = "themes/trackbox/interface.ejs";
trackbox.api.internal.theme.interface.default.html = function() {
	var shell = new EJS({url: trackbox.api.internal.theme.interface.default.path}).render();
	return shell;
};
trackbox.api.internal.theme.interface.list = function() {
	throw "Not Implemented";
};

trackbox.api.internal.theme.interface.default.button = {};
trackbox.api.internal.theme.interface.default.button.path = "themes/trackbox/button.ejs";

// Choose a default style to apply to the interface at startup
trackbox.api.internal.theme.interface.style = {};
trackbox.api.internal.theme.interface.style.default = {};
trackbox.api.internal.theme.interface.style.default.name = "trackbox.light";
trackbox.api.internal.theme.interface.style.default.paths = ["themes/trackbox/interface.css"];
trackbox.api.internal.theme.interface.style.list = function() {
	throw "Not Implemented";
};
trackbox.api.internal.theme.interface.style.getStyled = function(interfaceName) {
	for(i = 0; i < trackbox.api.internal.theme.interface.style.default.paths.length; ++i) {
		$("head").append('<link href=\"' + trackbox.api.internal.theme.interface.style.default.paths[i] + '\" rel=\"stylesheet\"/>');
	}
};

// Load all of the frames
trackbox.api.internal.theme.frames = {};
trackbox.api.internal.theme.frames.list = [
	{
		name: "songs",
		path: ""
	},
	{

	},
];