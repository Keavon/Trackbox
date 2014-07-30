tb.private.library = [
	{ "title": "40 Years Later", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/01%2040%20years%20later.mp3", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 1, "disk": 1, "time": 31 },
	{ "title": "The Dome", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/02%20The%20dome.mp3", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 2, "disk": 1, "time": 311 },
	{ "title": "The Battle", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/03%20The%20battle.mp3", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 3, "disk": 1, "time": 123 },
	{ "title": "End Credits", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/04%20End%20credits.mp3", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 4, "disk": 1, "time": 103 },

	{ "title": "The Wires", "location": "http://download.blender.org/ED/1-TheWires.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 1, "disk": 1, "time": 75 },
	{ "title": "Typewriter Dance", "location": "http://download.blender.org/ED/2-TypewriterDance.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 2, "disk": 1, "time": 70 },
	{ "title": "The Safest Place", "location": "http://download.blender.org/ED/3-TheSafestPlace.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, /*"track": 3,*/ "disk": 1, "time": 45 },
	{ "title": "Emo Creates", "location": "http://download.blender.org/ED/4-EmoCreates.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, /*"track": 4,*/ "disk": 1, "time": 60 },
	{ "title": "End Title", "location": "http://download.blender.org/ED/5-EndTitle.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 5, "disk": 1, "time": 91 },
	{ "title": "Teaser Music", "location": "http://download.blender.org/ED/6-TeaserMusic.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 6, "disk": 1, "time": 75 },
	{ "title": "Ambience", "location": "http://download.blender.org/ED/7-Ambience.mp3", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, /*"track": 7,*/ "disk": 1, "time": 110 }
];

// Return a read only copy of the library.
tb.library = function () {
	return tb.private.library;
};

// Find tracks matching given parameters and returns an array with all matching songs
// Parameters filter the returned objects, which each item in the JSON array checked against every song's metadata to see if it matches
tb.find = function (parameters) {
	var array = [];
	for (var song in tb.private.library) {
		var matched = true;

		if (parameters.album && matched !== false) {
			if (parameters.album !== tb.private.library[song].album) {
				matched = false;
			}
		}

		if (parameters.track && matched !== false) {
			if (parameters.track !== tb.private.library[song].track) {
				matched = false;
			}
		}

		if (parameters.disk && matched !== false) {
			if (parameters.disk !== tb.private.library[song].disk) {
				matched = false;
			}
		}

		if (parameters.duration && parameters.duration.seconds && matched !== false) {
			if (parameters.duration.seconds !== tb.private.library[song].duration.seconds) {
				matched = false;
			}
		}

		if (parameters.duration && parameters.duration.mintues && matched !== false) {
			if (parameters.duration.minutes !== tb.private.library[song].duration.minutes) {
				matched = false;
			}
		}

		if (parameters.duration && parameters.duration.hours && matched !== false) {
			if (parameters.duration.hours !== tb.private.library[song].duration.hours) {
				matched = false;
			}
		}

		if (parameters.location && matched !== false) {
			if (parameters.location !== tb.private.library[song].location) {
				matched = false;
			}
		}

		if (parameters.year && matched !== false) {
			if (parameters.year !== tb.private.library[song].year) {
				matched = false;
			}
		}

		if (parameters.title && matched !== false) {
			if (parameters.title !== tb.private.library[song].title) {
				matched = false;
			}
		}

		if (parameters.artists && matched !== false) {
			// Check if the selected artist in parameters matches one of the artists in selected song in the library.
			for (var artist in parameters.artists) {
				var songMatched = false;

				for (var libraryArtist in tb.private.library[song].artists) {
					if (parameters.artists[artist] === tb.private.library[song].artists[libraryArtist]) {
						songMatched = true;
					}
				}
				if (songMatched !== true) {
					matched = false;
				}

				if (matched === false) {
					break;
				}
			}
		}

		if (matched === true) {
			// If the song matched, send it to the calling function.
			array.push(tb.private.library[song]);
		}
	}
	return array;
};

tb.sortByPriority = function (opt) {
	if (!(opt instanceof Array)) {
		opt = Array.prototype.slice.call(arguments);
	}
	return function (a, b) {
		for (var i = 0; i < opt.length; ++i) {
			var order = opt[i].substr(0, 1);
			var key = opt[i].substr(1);
			if (order !== '-' && order !== '+') {
				key = opt[i];
				order = '+';
			}
			if (a[key] !== b[key]) {
				if (a[key] === undefined) { return 1; }
				if (b[key] === undefined) { return -1; }
				if (typeof a[key] === 'string' || typeof b[key] === 'string') {
					return (order === '+' ? String(a[key]).toLowerCase() < String(b[key]).toLowerCase() : String(a[key]).toLowerCase() > String(b[key]).toLowerCase()) ? -1 : 1;
				} else {
					return (order === '+' ? a[key] < b[key] : a[key] > b[key]) ? -1 : 1;
				}
			}
		}
		return 0;
	};
};