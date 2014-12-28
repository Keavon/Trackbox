// Loads a page given its repo name
tb.loadPage = function (repo) {
	// Clear the existing page and its CSS/JS dependencies from the DOM
	$("#page").html("");
	$("#page-dependency-container").remove();
	$("body").prepend('<div id="page-dependency-container"></div>');

	// Trigger the initiation of the page loading
	tb.triggerOnPageLoadInitiated(repo);

	// Find the package from its given repo name
	tb.findPackages({ "repo": repo }, false, function (pages) {
		// Load the CSS dependencies for the new page
		if (pages[0].css) {
			Object.keys(pages[0].css).forEach(function (css) {
				tb.renderPalette(pages[0].location, pages[0].css[css], function (renderedPalette) {
					$("#page-dependency-container").append('<style type="text/css">' + renderedPalette + '</style>');
				});
			});
		}

		// Load the JavaScript dependencies for the new page
		if (pages[0].javascript) {
			Object.keys(pages[0].javascript).forEach(function (js) {
				$("#page-dependency-container").append('<script src="' + pages[0].location + "/" + pages[0].javascript[js] + '"></' + 'script>');
			});
		}
		// Render the page's template
		tb.renderTemplate(pages[0].location + "/" + pages[0].page, function (page) {
			// Add the page to the DOM
			$("#page").html(page);
			// Trigger the completion of the page loading
			tb.triggerOnPageLoadCompleted(repo);
		});
	});
};

// Triggers onPageLoadInitiated
tb.triggerOnPageLoadInitiated = function (repo) {
	$.event.trigger("onPageLoadInitiated", [repo]);
};

// Calls back when a page load has started
tb.onPageLoadInitiated = function (callback) {
	$(window).on("onPageLoadInitiated", function (event, repo) {
		callback(repo);
	});
};

// Triggers onPageLoadCompleted
tb.triggerOnPageLoadCompleted = function (repo) {
	$.event.trigger("onPageLoadCompleted", [repo]);
};

// Calls back when a page has finished loading
tb.onPageLoadCompleted = function (callback) {
	$(window).one("onPageLoadCompleted", function (event, repo) {
		callback(repo);
	});
};
