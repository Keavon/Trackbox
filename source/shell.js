// Loads a shell of a given location into the document body
tb.loadShell = function (shellLocation) {
	// Find the shell with the given location
	tb.findPackages({ "location": shellLocation }, false, function (shell) {
		// Clear the HTML body and give it the shell dependency container
		$("body").html('<div id="shell-dependency-container"></div>');
		// Check if the shell has any CSS to load
		if (shell[0].css) {
			// Load every CSS
			Object.keys(shell[0].css).forEach(function (css) {
				// Render every CSS file's palettes
				tb.paletteFile(shell[0].location, shell[0].css[css], function (renderedPalette) {
					// Insert the rendered CSS into the shell dependency container
					$("#shell-dependency-container").append('<style type="text/css">' + renderedPalette + '</style>');
				});
			});
		}
		// Check if the shell has any JavaScript to load
		if (shell[0].javascript) {
			// Load every JavaScript
			Object.keys(shell[0].javascript).forEach(function (js) {
				// Insert the JavaScript link into the shell dependency
				$("#shell-dependency-container").append('<script src="' + shell[0].location + "/" + shell[0].javascript[js] + '"></' + 'script>');
			});
		}

		// Fill the document body with the shell and call the router
		// Render the shell's HTML
		tb.renderFile(shellLocation + "/" + shell[0].shell, function (shell) {
			// Add the shell to the body after the dependency containers
			$("body").append(shell);

			// After the packages have been loaded, call the router
			tb.onPackagesLoaded(function () {
				tb.router();
			});

			// Trigger the shell loaded event
			tb.triggerOnShellLoaded();
		});
	}, 1);
};

// Triggers onShellLoaded
tb.triggerOnShellLoaded = function () {
	$.event.trigger("onShellLoaded");
};

// Calls back when the shell has been loaded
tb.onShellLoaded = function (callback) {
	$(window).on("onShellLoaded", function () {
		callback();
	});
};