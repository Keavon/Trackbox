tb.router = function () {
	var currentPage = window.location.hash.substring(1);
	if (window.location.hash) {
		tb.findPackages({ "type": "page" }, false, function (pages) {
			Object.keys(pages).forEach(function (page) {
				if (pages[page].url === currentPage) {
					tb.loadPage(pages[page].repo);
				} else {
					Object.keys(pages[page].standardUrl).forEach(function (url) {
						if (pages[page].standardUrl[url] === currentPage) {
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