var library = tb.library();

library.sort(tb.sortByPriority("+album", "+disk", "+track", "+title"));

tb.getFileContents("packages/songs/templates/list-row.html", function (data) {
	for (var songs in library) {
		library[songs].title = library[songs].title || "";
		library[songs].artists[0] = library[songs].artists[0] || "";
		library[songs].album = library[songs].album || "";
		library[songs].year = library[songs].year || "";
		library[songs].track = library[songs].track || "";
		library[songs].disk = library[songs].disk || "";
		library[songs].time = library[songs].time || "";

		tb.renderTextTemplate(data, { "TITLE": library[songs].title, "NUMBER": library[songs].track, "ALBUM": library[songs].album, "ARTIST": library[songs].artists[0], "TIME": tb.formatTime(library[songs].time) }, function (template) {
			$("#list-frame").append(template);
		});
	}
});