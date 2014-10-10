// Loads a shell of a given location into the document body
tb.loadShell = function (shellLocation) {
	tb.findPackages({ "location": shellLocation }, false, function (shell) {
		$("body").html('<div id="shell-dependency-container"></div>');
		if (shell[0].css) {
			Object.keys(shell[0].css).forEach(function (css) {
				tb.renderPalette(shell[0].location, shell[0].css[css], function (renderedPalette) {
					$("#shell-dependency-container").append('<style type="text/css">' + renderedPalette + '</script>');
				});
			});
		}
		if (shell[0].javascript) {
			Object.keys(shell[0].javascript).forEach(function (js) {
				$("#shell-dependency-container").append('<script src="' + shell[0].location + "/" + shell[0].javascript[js] + '"></' + 'script>');
			});
		}

		// Fill document body with shell and call router
		tb.renderTemplate(shellLocation + "/" + shell[0].shell, function (shell) {
			$("body").append(shell);
			tb.packageStartup();
			tb.onPackagesLoaded(function () {
				tb.router();
			});
			tb.triggerOnShellLoaded();
		});
	}, 1);
};

tb.triggerOnShellLoaded = function () {
	$.event.trigger("onShellLoaded");
};

tb.onShellLoaded = function (callback) {
	$(window).on("onShellLoaded", function () {
		callback();
	});
};