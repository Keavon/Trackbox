tb.loadPage = function (name) {
	var pagePath = "packages/" + name + "/" + name + ".html";
	tb.renderTemplate(pagePath, function (page) {
		page = '<div id="includes"></div>' + page;
		$("#page").html(page);
	});
};