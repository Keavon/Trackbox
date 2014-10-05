tb.loadPage = function (repo) {
	$.event.trigger("onPageLoadInitiated", [repo]);
	tb.findPackages({ "repo": repo }, false, function (data) {
		tb.renderTemplate(data[0].location + "/" + data[0].page, function (page) {
			page = '<div id="includes"></div>' + page;
			$("#page").html(page);
			$.event.trigger("onPageLoadCompleted", [repo]);
		});
	});
};

tb.onPageLoadInitiated = function (callback) {
	$(window).on("onPageLoadInitiated", function (event, repo) {
		callback(repo);
	});
};

tb.onPageLoadCompleted = function (callback) {
	$(window).on("onPageLoadCompleted", function (event, repo) {
		callback(repo);
	});
};