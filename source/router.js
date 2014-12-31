// Routes URL hash changes to the right page
tb.router = function () {
	// Occurs when the URL hash changes
	if (window.location.hash) {
		// Find all pages
		tb.findPackages({ "type": "page" }, false, function (pages) {
			// Check if each page's URL equals the hash name
			Object.keys(pages).forEach(function (page) {
				if (pages[page].url === window.location.hash.substring(1)) {
					// Load page that fits page URL
					tb.loadPage(pages[page].repo);
				} else {
					// Check if each page's standard URL equals the hash name
					Object.keys(pages[page].standardUrl).forEach(function (url) {
						if (pages[page].standardUrl[url] === window.location.hash.substring(1)) {
							// Load page that fits page standard URL
							tb.loadPage(pages[page].repo);
						}
					});
				}
			});
		});
	} else {
		// If none fit, change hash to the default page
		window.location.hash = "#" + tb.preferences().defaultPage;
	}
};

// Returns the current page URL
tb.getCurrentPageUrl = function () {
	return window.location.hash.substring(1);
};