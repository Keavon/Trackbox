var list;
$.getScript("themes/trackbox/frames/data.js", function (data) {
	list = listings.songs;
	$("#list-frame").html(function () {
		return new EJS({ url: "themes/trackbox/frames/song/song.ejs" }).render();
	});
});