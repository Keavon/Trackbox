tb.loadPage = {};
tb.loadPage.v1 = function (name) {
	var pagePath = "packages/" + name + "/" + name + ".html";
	tb.getFileContents.v1(pagePath, function (page) {
		page = '<div id="includes"></div>' + page;
		$("#page").html(page);
	});
};