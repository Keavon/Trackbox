// Initialize the database
tb.private.libraryDb = new PouchDB("library", function () {
	tb.triggerOnLibraryReady();
});

// Triggers onPackagesLoaded and marks the library as ready
tb.triggerOnLibraryReady = function () {
	tb.setLibraryReady();
	$.event.trigger("onLibraryReady");
};

// Calls back when the library is ready
tb.onLibraryReady = function (callback) {
	$(window).on("onLibraryReady", function () {
		callback();
	});
};

// Returns true if the library is ready for use, otherwise false
tb.isLibraryReady = function () {
	return tb.private.libraryReady || false;
};

// Set the library as being ready for use with an optional argument of false setting it to not ready
tb.setLibraryReady = function (isReady) {
	// If there are no arguments, set the default to true
	if (typeof isReady !== "boolean") {
		isReady = true;
	}

	// Set libraryReady to true or false
	tb.private.libraryReady = isReady;
};

// Calls back with the whole library without other arguments and calls back with a subset of the library given a property key and a value of the key
tb.getLibrary = function (key, value, callback) {
	// TODO: Implement count

	if (typeof key === "function") {
		// Return whole library
		callback = key;

		// Query immediately or after the database is ready
		if (tb.isLibraryReady()) {
			queryAll();
		} else {
			tb.onLibraryReady(function () {
				queryAll();
			});
		}
	} else if (typeof key === "string" && typeof value !== "function" && typeof callback === "function") {
		// Key and value given

		// Query immediately or after the database is ready
		if (tb.isLibraryReady()) {
			queryKey(key, value);
		} else {
			tb.onLibraryReady(function () {
				queryKey(key, value);
			});
		}
	} else {
		console.error("Library can't be fetched because incorrect arguments are given.");
	}

	// Fetches the full library efficiently
	function queryAll() {
		tb.private.libraryDb.allDocs({ include_docs: true }, function (err, response) {
			if (!err) {
				// Pulls the documents out of the response
				var library = [];
				response.rows.forEach(function (entry) {
					library.push(entry.doc);
				});

				// Calls back with the library
				callback(library);
			} else {
				console.error("Error reading library database.");
			}
		});
	}

	// Fetches a selection based on a properties key and its value
	function queryKey(key, value) {

		// Define the map functions for each key
		// TODO: Change to persistent queries for pre-indexed efficiency
		function mapId(doc) { emit(doc._id); }
		function mapTitle(doc) { emit(doc.title); }
		function mapLocation(doc) { emit(doc.location); }
		function mapArtwork(doc) { emit(doc.artwork); }
		function mapAlbum(doc) { emit(doc.album); }
		function mapYear(doc) { emit(doc.year); }
		function mapTrack(doc) { emit(doc.track); }
		function mapDisk(doc) { emit(doc.disk); }
		function mapTime(doc) { emit(doc.time); }

		// Lowercase to avoid capitalization-related errors
		key = key.toLowerCase();

		// Chooses the correct map function based on the given key
		var chosenMap;
		if (key === "_id") {
			chosenMap = mapId;
		} else if (key === "title") {
			chosenMap = mapTitle;
		} else if (key === "location") {
			chosenMap = mapLocation;
		} else if (key === "artwork") {
			chosenMap = mapArtwork;
		} else if (key === "album") {
			chosenMap = mapAlbum;
		} else if (key === "year") {
			chosenMap = mapYear;
		} else if (key === "track") {
			chosenMap = mapTrack;
		} else if (key === "disk") {
			chosenMap = mapDisk;
		} else if (key === "time") {
			chosenMap = mapTime;
		} else {
			console.error("Library can't be fetched because the given properties key is not valid.");
		}

		// Query the database with the chosen map function
		tb.private.libraryDb.query(chosenMap, {
			key: value,
			include_docs: true
		}, function (err, response) {
			// Pulls the documents out of the response
			var library = [];
			response.rows.forEach(function (entry) {
				library.push(entry.doc);
			});

			// Calls back with the library
			callback(library);
		});
	}
};

// Calls back with a track given its ID
tb.getTrack = function (id, callback) {
	// Fetches the library with this specific ID
	tb.getLibrary("_id", id, function (track) {
		// Calls back with the track itself
		callback(track[0]);
	});
};

// Returns a function with logic to sort an array in ascending or descending order based on given properties
// http://stackoverflow.com/a/25030191/775283
tb.sortByProperties = function (sortProperties) {
	// Place all arguments in an array
	if (!(sortProperties instanceof Array)) {
		sortProperties = Array.prototype.slice.call(arguments);
	}
	return function (a, b) {
		// Go through every sort property
		for (var i = 0; i < sortProperties.length; ++i) {
			// Remove the - or + prefix from the key
			var key = sortProperties[i].substr(1);

			// Store the first character to determine the + or - prefix
			var order = sortProperties[i].substr(0, 1);

			// If the first character was not + or - then default to + and add the first character back to the key
			if (order !== '-' && order !== '+') {
				key = sortProperties[i];
				order = '+';
			}

			// Sort logic
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

////////// DEBUGGING //////////
tb.addLibrary = function () {
	tb.private.libraryDb.bulkDocs(tb.private.librarySongData);
};

tb.destroyLibrary = function () {
	PouchDB.destroy('library');
};

tb.private.librarySongData = [
	{ "title": "40 Years Later", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/01%2040%20years%20later.mp3", "artwork": "packages/albums/placeholders/tears_of_steel.png", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 1, "disk": 1, "time": 31 },
	{ "title": "The Dome", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/02%20The%20dome.mp3", "artwork": "packages/albums/placeholders/tears_of_steel.png", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 2, "disk": 1, "time": 311 },
	{ "title": "The Battle", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/03%20The%20battle.mp3", "artwork": "packages/albums/placeholders/tears_of_steel.png", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 3, "disk": 1, "time": 123 },
	{ "title": "End Credits", "location": "http://download.blender.org/demo/movies/ToS/Tears-Of-Steel-OST/04%20End%20credits.mp3", "artwork": "packages/albums/placeholders/tears_of_steel.png", "artists": ["Joram Letwory"], "album": "Tears of Steel", "year": 2012, "track": 4, "disk": 1, "time": 103 },

	{ "title": "The Wires", "location": "http://download.blender.org/ED/1-TheWires.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 1, "disk": 1, "time": 75 },
	{ "title": "Typewriter Dance", "location": "http://download.blender.org/ED/2-TypewriterDance.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 2, "disk": 1, "time": 70 },
	{ "title": "The Safest Place", "location": "http://download.blender.org/ED/3-TheSafestPlace.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 3, "disk": 1, "time": 45 },
	{ "title": "Emo Creates", "location": "http://download.blender.org/ED/4-EmoCreates.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 4, "disk": 1, "time": 60 },
	{ "title": "End Title", "location": "http://download.blender.org/ED/5-EndTitle.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 5, "disk": 1, "time": 91 },
	{ "title": "Teaser Music", "location": "http://download.blender.org/ED/6-TeaserMusic.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 6, "disk": 1, "time": 75 },
	{ "title": "Ambience", "location": "http://download.blender.org/ED/7-Ambience.mp3", "artwork": "packages/albums/placeholders/elephants_dream.jpg", "artists": ["Jan Morgenstern"], "album": "Elephants Dream", "year": 2006, "track": 7, "disk": 1, "time": 110 },

	{ "title": "Snow Fight", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_01_-_Snow_Fight.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 1, "disk": 1, "time": 107 },
	{ "title": "Finding Scales / Chicken Run", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_02_-_Finding_Scales__Chicken_Run.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 2, "disk": 1, "time": 107 },
	{ "title": "The Ziggurat", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_03_-_The_Ziggurat.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 3, "disk": 1, "time": 78 },
	{ "title": "Expedition", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_04_-_Expedition.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 4, "disk": 1, "time": 93 },
	{ "title": "Dragon Blood Tree", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_05_-_Dragon_Blood_Tree.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 5, "disk": 1, "time": 47 },
	{ "title": "Cave Fight / Lament", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_06_-_Cave_Fight__Lament.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 6, "disk": 1, "time": 145 },
	{ "title": "I Move On (Sintel's Song)", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern__Performed_by_Helena_Fix_-_07_-_I_Move_On_Sintels_Song.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 7, "disk": 1, "time": 169 },
	{ "title": "Circling Dragons", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_08_-_Circling_Dragons.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 8, "disk": 1, "time": 28 },
	{ "title": "Trailer Music", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_09_-_Trailer_Music.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 9, "disk": 1, "time": 44 }
];
//////// END DEBUGGING ////////