tb.router = function () {
	if (window.location.hash) {
		var currentPage = window.location.hash.substring(1);

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