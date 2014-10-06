tb.router = function () {
	if (window.location.hash) {
		tb.findPackages({ "type": "page" }, false, function (pages) {
			Object.keys(pages).forEach(function (page) {
				if (pages[page].url === window.location.hash.substring(1)) {
					tb.loadPage(pages[page].repo);
				} else {
					Object.keys(pages[page].standardUrl).forEach(function (url) {
						if (pages[page].standardUrl[url] === window.location.hash.substring(1)) {
							tb.loadPage(pages[page].repo);
						}
					});
				}
			});
		});
	} else {
		window.location.hash = "#" + tb.preferences().defaultPage;
	}
};

tb.getCurrentPageUrl = function () {
	return window.location.hash.substring(1);
};