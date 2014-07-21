trackbox.api.internal.theme.style = {};

// Container for every known style.
trackbox.api.internal.theme.style.styles = {};
trackbox.api.internal.theme.style.styles.trackboxLight = {
	"name": "Trackbox Light",
	"css": ["themes/styles/trackbox-light/trackbox-light.css"]
};

// Style currently in use.
trackbox.api.internal.theme.style.current = {};
trackbox.api.internal.theme.style.current.id = "trackboxLight";
trackbox.api.internal.theme.style.current.css = trackbox.api.internal.theme.style.styles[trackbox.api.internal.theme.style.current.id].css;

// Apply a style to the 
trackbox.api.internal.theme.style.apply = function() {
	for (var css in trackbox.api.internal.theme.style.current.css) {
		$("#shell-styles").append('<link href=\"' + trackbox.api.internal.theme.style.current.css[css] + '\" rel=\"stylesheet\"/>');
	}
};

// Change the shell's style.
trackbox.api.internal.theme.style.set = function(style) {
	if (trackbox.api.internal.theme.style.styles[style]) {
		trackbox.api.internal.theme.style.current.id = style;
		$("#shell-styles").empty();
		trackbox.api.internal.theme.style.apply();
	} else {
		console.log("Style \"" + style + "\" was not found." );
	}
};