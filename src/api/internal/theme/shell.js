// Handles the theming and rendering of the shell.
trackbox.api.internal.theme.shell = {};

// Container for every known shell.
trackbox.api.internal.theme.shell.shells = {};
trackbox.api.internal.theme.shell.shells.trackbox = {
	"name": "Trackbox",
	"shell": "themes/shells/trackbox/shell.html",
	"javascripts": [],
	"css": [],
	"button": "themes/shells/trackbox/button.ejs"
};

// Shell currently in use.
trackbox.api.internal.theme.shell.current             = {};
trackbox.api.internal.theme.shell.current.id          = "trackbox";
trackbox.api.internal.theme.shell.current.button      = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].button;
trackbox.api.internal.theme.shell.current.shell       = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].shell;
trackbox.api.internal.theme.shell.current.javascripts = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].javascripts;
trackbox.api.internal.theme.shell.current.css         = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].css;

// Render the shell
trackbox.api.internal.theme.shell.render = function () {
	// Get shell HTML and apply it to the document body
	$.ajax({
		url: trackbox.api.internal.theme.shell.current.shell,
		dataType: "text",
		success: function (data) {
			$("body").html(data);
		}
	});
};

// Change the shell
trackbox.api.internal.theme.shell.set = function(shell) {
	if (trackbox.api.internal.theme.shell.shells[shell]) {
		trackbox.api.internal.theme.shell.current.id = shell;
		init();
	} else {
		console.log('Shell "' + shell + '" was not found.');
	}
};