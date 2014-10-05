
// Loads a shell of a given location into the document body
tb.loadShell = function (shellLocation) {
	tb.findPackages({"location" : shellLocation}, false, function(data) {

		// Fill document body with shell and call router
		tb.renderTemplate(shellLocation + "/" + data[0].shell, function (shell) {
			$("body").html(shell);
			tb.packageStartup();
			tb.router();
		});
	}, 1);
};