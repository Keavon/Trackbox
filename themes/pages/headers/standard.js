var list;
$.getScript("themes/trackbox/frames/data.js", function (data) {
	if (view == "albums") {
		list = listings.albums;
		$("#standard-list").html(function () {
			return new EJS({ url: "themes/trackbox/frames/card/card.ejs" }).render();
		});
	}
	if (view == "artists") {
		list = listings.artists;
		$("#standard-list").html(function () {
			return new EJS({ url: "themes/trackbox/frames/card/card.ejs" }).render();
		});
	}
	if (view == "tags") {
		list = listings.tags;
		$.getScript("themes/trackbox/frames/tag/tag.js", function (data) {
			$("#standard-list").html(function () {
				return new EJS({ url: "themes/trackbox/frames/tag/tag.ejs" }).render();
			});
		});
	}
});