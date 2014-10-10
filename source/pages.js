tb.loadPage = function (repo) {
	tb.triggerOnPageLoadInitiated(repo);
	$("#page").html("");
	tb.findPackages({ "repo": repo }, false, function (pages) {
		$("#page-dependency-container").remove();
		$("body").prepend('<div id="page-dependency-container"></div>');

		if (pages[0].css) {
			Object.keys(pages[0].css).forEach(function (css) {
				tb.renderPalette(pages[0].location, pages[0].css[css], function (renderedPalette) {
					$("#page-dependency-container").append('<style type="text/css">' + renderedPalette + '</script>');
				});
			});
		}
		if (pages[0].javascript) {
			Object.keys(pages[0].javascript).forEach(function (js) {
				$("#page-dependency-container").append('<script src="' + pages[0].location + "/" + pages[0].javascript[js] + '"></' + 'script>');
			});
		}
		tb.renderTemplate(pages[0].location + "/" + pages[0].page, function (page) {
			$("#page").html(page);
			tb.triggerOnPageLoadCompleted(repo);
		});
	});
};

tb.triggerOnPageLoadInitiated = function (repo) {
	$.event.trigger("onPageLoadInitiated", [repo]);
};

tb.onPageLoadInitiated = function (callback) {
	$(window).on("onPageLoadInitiated", function (event, repo) {
		callback(repo);
	});
};

tb.triggerOnPageLoadCompleted = function (repo) {
	$.event.trigger("onPageLoadCompleted", [repo]);
};

tb.onPageLoadCompleted = function (callback) {
	$(window).on("onPageLoadCompleted", function (event, repo) {
		callback(repo);
	});
};