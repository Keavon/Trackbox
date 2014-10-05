tb.loadPage = function (repo) {
	tb.findPackages({ "repo": repo }, false, function (data) {
		tb.renderTemplate(data[0].location + "/" + data[0].page, function (page) {
			page = '<div id="includes"></div>' + page;
			$("#page").html(page);
		});
	});
};