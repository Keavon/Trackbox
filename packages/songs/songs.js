tb.onPageLoadCompleted(function () {
	var library = tb.getLibrary();
	library.sort(tb.sortByProperties("+album", "+disk", "+track", "+title"));

	tb.getFileContents("packages/songs/templates/list-row.html", function (data) {
		for (var song in library) {
			library[song].title = library[song].title || "<i>" + library[song].location.match(/[^/]*(?=\.[^.]+($|\?))/)[0] + "</i>" || "";
			library[song].artists[0] = library[song].artists[0] || "";
			library[song].album = library[song].album || "";
			library[song].year = library[song].year || "";
			library[song].track = library[song].track || "";
			library[song].disk = library[song].disk || "";
			library[song].time = library[song].time || "";

			var template = tb.render(data,
				{
					"ID": "song-" + library[song].id,
					"TITLE": library[song].title,
					"NUMBER": library[song].track,
					"ALBUM": library[song].album,
					"ARTIST": library[song].artists[0],
					"TIME": tb.formatTime(library[song].time)
				});
			$("#list-frame").append(template);
		}
	});

	$("#list-frame").dblclick(function (event) {
		if (typeof $(event.target).parents(".list-row").attr("id") === "undefined" && event.target.id.substring(0, 5) === "song-") {
			tb.setTrack(parseInt(event.target.id.substring(5)), true);
		} else if (typeof $(event.target).parents(".list-row").attr("id") === "undefined") {
			return;
		} else if ($(event.target).parents(".list-row").attr("id").substring(0, 5) === "song-") {
			tb.setTrack(parseInt($(event.target).parents(".list-row").attr("id").substring(5)), true);
		}
	});

	$("#list-frame").mousedown(function (event) {
		if (typeof $(event.target).parents(".list-row").attr("id") === "undefined" && event.target.id.substring(0, 5) === "song-") {
			songListSelection($(event.target).attr("id"));
		} else if (typeof $(event.target).parents(".list-row").attr("id") === "undefined") {
			return;
		} else if ($(event.target).parents(".list-row").attr("id").substring(0, 5) === "song-") {
			songListSelection($(event.target).parents(".list-row").attr("id"));
		}
	});

	$("#list-frame").on("mousedown", ".list-row a, .list-row label", function (event) {
		event.stopPropagation();
	});

	$("body").keydown(function (e) {
		if (e.keyCode === 38) {
			songListSelection("up");
		} else if (e.keyCode === 40) {
			songListSelection("down");
		} else if (e.keyCode === 13) {
			tb.setTrack(parseInt(songListSelection().substring(5)), true);
		}
	});

	function songListSelection(id) {
		var currentIndex = $(".list-row-selected:first").prevAll().length;
		if (arguments.length === 0) {
			return $("#list-frame > div:nth-child(" + (currentIndex + 1) + ")").attr("id");
		} else if (typeof id === "string") {
			if (id !== "up" && id !== "down") {
				$(".list-row-selected").removeClass("list-row-selected");
				$("#" + id).addClass("list-row-selected");
			} else {
				if (id === "up" && currentIndex > 0) {
					currentIndex--;
				} else if (id === "down" && currentIndex < $("#list-frame > div").length - 1) {
					currentIndex++;
				}
				$(".list-row-selected").removeClass("list-row-selected");
				$("#list-frame > div:nth-child(" + (currentIndex + 1) + ")").addClass("list-row-selected");
			}
		}
	}
});