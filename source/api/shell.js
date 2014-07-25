// Handles the theming and rendering of the shell.
trackbox.api.theme.shell = {};

// Container for every known shell.
trackbox.api.theme.shell.shells = {};
trackbox.api.theme.shell.shells.trackbox = {
	"name": "Trackbox",
	"location": "packages/trackbox/",
	"shell": "packages/trackbox/trackbox.html",
	"pageTab": "packages/trackbox/templates/page-tab.html"
};

// Shell currently in use.
trackbox.api.theme.shell.current             = {};
trackbox.api.theme.shell.current.id          = "trackbox";
trackbox.api.theme.shell.current.location    = trackbox.api.theme.shell.shells[trackbox.api.theme.shell.current.id].location;
trackbox.api.theme.shell.current.pageTab     = trackbox.api.theme.shell.shells[trackbox.api.theme.shell.current.id].pageTab;
trackbox.api.theme.shell.current.name        = trackbox.api.theme.shell.shells[trackbox.api.theme.shell.current.id].name;
trackbox.api.theme.shell.current.shell       = trackbox.api.theme.shell.shells[trackbox.api.theme.shell.current.id].shell;

// Render the shell
trackbox.api.theme.shell.render = function () {
	// Get shell HTML and apply it to the document body
	getFileContents(trackbox.api.theme.shell.current.shell, function (data) {
		$("body").html(data);
	});
};

// Change the shell
trackbox.api.theme.shell.set = function(shell) {
	if (trackbox.api.theme.shell.shells[shell]) {
		trackbox.api.theme.shell.current.id = shell;
		init();
	} else {
		console.log('Shell "' + shell + '" was not found.');
	}
};