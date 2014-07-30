var library = tb.find({});

library.sort(tb.sortByPriority.v1(["album", "disk", "track", "title"]));

tb.getFileContents.v1("packages/songs/templates/list-row.html", function (data) {
	for (var songs in library) {
		tb.renderTextTemplate.v1(data, { "TITLE": library[songs].title, "NUMBER": library[songs].track, "ALBUM": library[songs].album, "ARTIST": library[songs].artists[0], "TIME": tb.formatTime.v1(library[songs].time) }, function (template) {
			$("#list-frame").append(template);
		});
	}
});