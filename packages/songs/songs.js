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

		var currentTrackIndex;

		// Play a song on double click
		$('#list-frame').on('dblclick', 'tr', function () {
			// Load the selected track
			tb.setCurrentTrack($(this).attr("data-track-id"), true);
			currentTrackIndex = $(this).index();
		});

		// Move selection up and down and play the selected track upon hitting Enter
		$(document).keydown(function (key) {
			// Up, down, or enter
			if (key.keyCode === 38 || key.keyCode === 40 || key.keyCode === 13 || key.keyCode === 32) {
				// Get the index of the currently selected row
				var index = $("#list-frame tr.selected").index();

				// Prevent up/down/spacebar from scrolling the window
				key.preventDefault();

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
					currentTrackIndex = index;
				}
			}
		});

		// Selects a track given its ID and scrolls to it if it is above or below the view
		function selectRow(id) {
			// Select target row
			var targetRow = $("#list-frame tr[data-track-id=" + id + "]");
			var targetFrame = $("#list-frame");

			// Unselects the currently selected row
			$(".selected").removeClass("selected");

			// Selects the row with the given ID
			targetRow.addClass("selected");

			// Find the pixels above the selected row to the top of the table of rows
			var distanceAboveElement = targetRow.offset().top - targetRow.parent().offset().top - targetRow.parent().scrollTop();
			// Find the pixels of hidden content above the current scroll position
			var scrollDistanceAbove = targetFrame.scrollTop();

			// Check if the selection is above the view
			if (distanceAboveElement < scrollDistanceAbove) {
				// Set the scroll position as the current scroll minus the difference
				targetFrame.scrollTop(targetFrame.scrollTop() - (scrollDistanceAbove - distanceAboveElement));
			} else {
				// Find the pixels below the selected row to the bottom of the table of rows
				var distanceBelowElement = targetFrame[0].scrollHeight - distanceAboveElement - targetRow.height();
				// Find the pixels of hidden content below the current scroll position
				var scrollDistanceBelow = targetFrame[0].scrollHeight - targetFrame.scrollTop() - targetFrame.height();

				// Check if the selection is below the view
				if (distanceBelowElement < scrollDistanceBelow) {
					// Set the scroll position as the current scroll plus the difference
					targetFrame.scrollTop(targetFrame.scrollTop() + (scrollDistanceBelow - distanceBelowElement));
				}
			}
		}

		// When the track ends, move on to the next track
		tb.onTrackEnded(function () {
			currentTrackIndex++;
			tb.setCurrentTrack($("#list-frame tr:nth-child(" + (currentTrackIndex + 1) + ")").attr("data-track-id"), true);
		});

		// Switch checkbox between enable/disable track and play/skip once
		$("#list-frame").on("mousedown", "input + label", function (event) {
			// Check for right click, event 3
			if (event.which === 3) {
				var checkbox = $(this).prev();
				if (checkbox.hasClass("once")) {
					// Turn it to once
					checkbox.removeClass("once");
				} else {
					// Turn it to normal checkmark
					checkbox.addClass("once");
				}
			}
		});
	});
});