tb.onPageLoadCompleted(function () {
	tb.getLibrary(function (library) {
		// Sort the library by album name, disk number, track number, and title
		library.sort(tb.sortByProperties("+album"));

		// Fetch the template for a table row
		tb.getFileContents("packages/albums/templates/card.html", function (card) {
			var albums = [];
			var artists = [];
			var artwork = [];
			for (var song in library) {
				if (albums.indexOf(library[song].album) === -1) {
					albums.push(library[song].album);
					artists.push(library[song].artists[0]);
					artwork.push(library[song].artwork);
				}
			}

			for (var i = 0; i < albums.length; i++) {
				// Renders the template for a table row
				var template = tb.render(card,
					{
						"ARTWORK": artwork[i],
						"ARTIST": artists[i],
						"ALBUM": albums[i]
					});

				// Appends this row to the bottom of the table
				$("#page").append(template);
			}
		});
	});
});