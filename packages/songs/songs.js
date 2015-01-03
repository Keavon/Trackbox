tb.onPageLoadCompleted(function () {
	tb.getLibrary(function (library) {
		// Sort the library by album name, disk number, track number, and title
		library.sort(tb.sortByProperties("+album", "+disk", "+track", "+title"));

		// Fetch the template for a table row
		tb.getFileContents("packages/songs/templates/list-row.html", function (data) {
			// Add a row to the table for every song
			for (var song in library) {
				// Song title or file name if title is missing
				library[song].title = library[song].title || "<i>" + library[song].location.match(/[^/]*(?=\.[^.]+($|\?))/)[0] + "</i>" || "";
				// TODO: Show all artists
				library[song].artists[0] = library[song].artists[0] || "";
				library[song].album = library[song].album || "";
				library[song].year = library[song].year || "";
				library[song].track = library[song].track || "";
				library[song].disk = library[song].disk || "";
				library[song].time = library[song].time || "";

				// Renders the template for a table row
				var template = tb.render(data,
					{
						"ID": library[song]._id,
						"TITLE": library[song].title,
						"NUMBER": library[song].track,
						"ALBUM": library[song].album,
						"ARTIST": library[song].artists[0],
						"TIME": tb.formatTime(library[song].time)
					});

				// Appends this row to the bottom of the table
				$("#list-frame").append(template);
			}
		});

		// Select a row on mousedown
		$('#list-frame').on('mousedown', 'tr', function () {
			selectRow($(this).attr("data-track-id"));
		});

		// Play a song on double click
		$('#list-frame').on('dblclick', 'tr', function () {
			// Load the selected track
			tb.setCurrentTrack($(this).attr("data-track-id"), true);
		});

		// Move selection up and down and play the selected track upon hitting Enter
		$(document).keydown(function (key) {
			// Up, down, or enter
			if (key.keyCode === 38 || key.keyCode === 40 || key.keyCode === 13) {
				// Get the index of the currently selected row
				var index = $("#list-frame tr.selected").index();
			}

			if (key.keyCode === 38) {
				// Up

				// Make sure it's not already at the top
				if (index > 0) {
					// Select the track above it
					selectRow($("#list-frame tr:nth-child(" + index + ")").attr("data-track-id"));
				}
			} else if (key.keyCode === 40) {
				// Down

				// Make sure it's not already at the bottom
				if (index < $("#list-frame tr").length - 1) {
					// Select the track below it
					selectRow($("#list-frame tr:nth-child(" + (index + 2) + ")").attr("data-track-id"));
				}
			} else if (key.keyCode === 13) {
				// Play

				// Load the selected track
				tb.setCurrentTrack($("#list-frame tr:nth-child(" + (index + 1) + ")").attr("data-track-id"), true);
			}
		});

		// Selects a track given its ID
		function selectRow(id) {
			// Unselects the currently selected row
			$(".selected").removeClass("selected");

			// Selects the row with the given ID
			$("#list-frame tr[data-track-id=" + id + "]").addClass("selected");
		}
	});
});