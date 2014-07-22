// Handles the theming and rendering of the shell.
trackbox.api.internal.theme.shell = {};

// Container for every known shell.
trackbox.api.internal.theme.shell.shells = {};
trackbox.api.internal.theme.shell.shells.trackbox = {
	"name": "Trackbox",
	"location": "themes/shells/trackbox/",
	"shell": "themes/shells/trackbox/shell.html",
	"pageTab": "themes/shells/trackbox/templates/page-tab.html"
};

// Shell currently in use.
trackbox.api.internal.theme.shell.current             = {};
trackbox.api.internal.theme.shell.current.id          = "trackbox";
trackbox.api.internal.theme.shell.current.location    = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].location;
trackbox.api.internal.theme.shell.current.pageTab     = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].pageTab;
trackbox.api.internal.theme.shell.current.name        = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].name;
trackbox.api.internal.theme.shell.current.shell       = trackbox.api.internal.theme.shell.shells[trackbox.api.internal.theme.shell.current.id].shell;

// Render the shell
trackbox.api.internal.theme.shell.render = function () {
	// Get shell HTML and apply it to the document body
	shell = $.ajax({
				async: false,
				url: trackbox.api.internal.theme.shell.current.shell,
				dataType: "text"
			}).responseText;

	$("body").html(shell);
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