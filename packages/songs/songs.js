var library = tb.library();

library.sort(tb.sortByPriority("+album", "+disk", "+track", "+title"));

tb.getFileContents("packages/songs/templates/list-row.html", function (data) {
	for (var song in library) {
		library[song].title = library[song].title || "";
		library[song].artists[0] = library[song].artists[0] || "";
		library[song].album = library[song].album || "";
		library[song].year = library[song].year || "";
		library[song].track = library[song].track || "";
		library[song].disk = library[song].disk || "";
		library[song].time = library[song].time || "";

		tb.renderTextTemplate(data, { "ID" : "song-" + library[song].id, "TITLE": library[song].title, "NUMBER": library[song].track, "ALBUM": library[song].album, "ARTIST": library[song].artists[0], "TIME": tb.formatTime(library[song].time) }, function (template) {
			$("#list-frame").append(template);
		});
	}
});

$("#list-frame").dblclick(function (event) {
	if (typeof $(event.target).parents(".list-row").attr("id") === "undefined" && event.target.id.substring(0, 5) === "song-") {
		alert(event.target.id);
	} else if (typeof $(event.target).parents(".list-row").attr("id") === "undefined") {
		return;
	} else if ($(event.target).parents(".list-row").attr("id").substring(0, 5) === "song-") {
		alert($(event.target).parents(".list-row").attr("id"));
	}
});