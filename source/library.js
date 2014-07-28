// Array of JSON objects that store the music library.

tb.private.library = [
	{"name" : "Overture", "location" : "file://path/to/a/file/at/some/point", "artists" : ["Zelda Reorchestrated"], "album" : "Twilight Symphony", "year" : "2013", "track" : "1", "disk" : "1", "duration" : { "hours" : "0", "minutes" : "6", "seconds" : "36"}},
	{"name" : "Back from the Spring", "location" : "file://path/to/a/file/at/some/point", "artists" : ["Zelda Reorchestrated"], "album" : "Twilight Symphony", "year" : "2013", "track" : "2", "disk" : "1", "duration" : { "hours" : "0", "minutes" : "1", "seconds" : "43"}},
];

// Return a read only copy of the library.
tb.library = function() {
	return tb.private.library;
}

// Find music tracks that match given parameters.
//
// Callbacks once for every song found and null when finished.
//
// parameters filters the returned objects, which each item in
// the JSON array checked against every song's metadata to see if it matches
//
// Example:
//
// tb.find({"track" : "2", "artists" : ["Zelda Reorchestrated"], "duration" : { "minutes" : "1", "seconds" : "43"}}, function(data){
//     console.log(data);
// });


tb.find = function(parameters, callback) {
	for(song in tb.private.library) {
		var matched = true;

		if(parameters.album && matched != false) {
			if(parameters.album !== tb.private.library[song].album) {
				matched = false;
			}
		}

		if(parameters.track && matched != false) {
			if(parameters.track !== tb.private.library[song].track) {
				matched = false;
			}
		}

		if(parameters.disk && matched != false) {
			if(parameters.disk !== tb.private.library[song].disk) {
				matched = false;
			}
		}

		if(parameters.duration && parameters.duration.seconds && matched != false) {
			if(parameters.duration.seconds !== tb.private.library[song].duration.seconds) {
				matched = false;
			}
		}

		if(parameters.duration && parameters.duration.mintues && matched != false) {
			if(parameters.duration.minutes !== tb.private.library[song].duration.minutes) {
				matched = false;
			}
		}

		if(parameters.duration && parameters.duration.hours && matched != false) {
			if(parameters.duration.hours !== tb.private.library[song].duration.hours) {
				matched = false;
			}
		}

		if(parameters.location && matched != false) {
			if(parameters.location !== tb.private.library[song].location) {
				matched = false;
			}
		}

		if(parameters.year && matched != false) {
			if(parameters.year !== tb.private.library[song].year) {
				matched = false;
			}
		}

		if(parameters.name && matched != false) {
			if(parameters.name !== tb.private.library[song].name) {
				matched = false
			}
		}

		if(parameters.artists && matched != false) {
			// Check if the selected artist in parameters matches one of the artists in selected song in the library.
			for(artist in parameters.artists) {
				var songMatched = false;

				for(libraryArtist in tb.private.library[song].artists) {
					if(parameters.artists[artist] === tb.private.library[song].artists[libraryArtist]) {
						songMatched = true;
					}
				}
				if(songMatched != true) {
					matched = false;
				}

				if(matched == false)  break;
			}
		}

		if(matched == true) {
			// If the song matched, send it to the calling function.
			callback(tb.private.library[song]);
		}
	}

	// Tell the calling function that the search has completed by sending null.
	callback(null);
}

// Temp testing function

