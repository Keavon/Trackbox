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
			if (!err && response.rows.length > 0) {
				// Pulls the documents out of the response
				var library = [];
				response.rows.forEach(function (entry) {
					library.push(entry.doc);
				});

				// Calls back with the library
				callback(library);
			} else {
				tb.addLibrary();
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
	location.reload();
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
	{ "title": "Trailer Music", "location": "https://archive.org/download/Sintel_Original_Film_Score-9838/Jan_Morgenstern_-_09_-_Trailer_Music.mp3", "artwork": "packages/albums/placeholders/sintel.jpg", "artists": ["Jan Morgenstern"], "album": "Sintel", "year": 2010, "track": 9, "disk": 1, "time": 44 },

	{ "title": "Black Mesa Theme", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Black Mesa Theme.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 1, "disk": 1, "time": 54 },
	{ "title": "Black Mesa Theme (Mesa Remix)", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Black Mesa Theme (Mesa Remix).mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 2, "disk": 1, "time": 78 },
	{ "title": "Inbound Part 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Inbound Part 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 3, "disk": 1, "time": 110 },
	{ "title": "Inbound Part 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Inbound Part 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 4, "disk": 1, "time": 240 },
	{ "title": "Inbound Part 3", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Inbound Part 3.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 5, "disk": 1, "time": 188 },
	{ "title": "Anomalous Materials", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Anomalous Materials.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 6, "disk": 1, "time": 59 },
	{ "title": "Unforeseen Consequences", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Unforeseen Consequences.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 7, "disk": 1, "time": 67 },
	{ "title": "Office Complex", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Office Complex.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 8, "disk": 1, "time": 80 },
	{ "title": "Office Complex (Mesa Remix)", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Office Complex (Mesa Remix).mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 9, "disk": 1, "time": 98 },
	{ "title": "We've Got Hostiles", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - We've Got Hostiles.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 10, "disk": 1, "time": 118 },
	{ "title": "Blast Pit 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Blast Pit 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 11, "disk": 1, "time": 63 },
	{ "title": "Blast Pit 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Blast Pit 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 12, "disk": 1, "time": 89 },
	{ "title": "Blast Pit 2 (Mesa Remix)", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Blast Pit 2 (Mesa Remix).mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 13, "disk": 1, "time": 119 },
	{ "title": "Blast Pit 3", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Blast Pit 3.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 14, "disk": 1, "time": 92 },
	{ "title": "Power Up", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Power Up.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 15, "disk": 1, "time": 50 },
	{ "title": "On a Rail 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - On a Rail 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 16, "disk": 1, "time": 135 },
	{ "title": "On a Rail 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - On a Rail 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 17, "disk": 1, "time": 68 },
	{ "title": "Apprehension", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Apprehension.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 18, "disk": 1, "time": 107 },
	{ "title": "Apprehension (Mesa Remix)", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Apprehension (Mesa Remix).mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 19, "disk": 1, "time": 87 },
	{ "title": "Residue Processing", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Residue Processing.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 20, "disk": 1, "time": 61 },
	{ "title": "Questionable Ethics 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Questionable Ethics 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 21, "disk": 1, "time": 82 },
	{ "title": "Questionable Ethics 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Questionable Ethics 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 22, "disk": 1, "time": 55 },
	{ "title": "Surface Tension 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Surface Tension 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 23, "disk": 1, "time": 150 },
	{ "title": "Surface Tension 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Surface Tension 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 24, "disk": 1, "time": 121 },
	{ "title": "Surface Tension 3", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Surface Tension 3.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 25, "disk": 1, "time": 100 },
	{ "title": "Surface Tension 4", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Surface Tension 4.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 26, "disk": 1, "time": 90 },
	{ "title": "Forget About Freeman", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Forget About Freeman.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 27, "disk": 1, "time": 150 },
	{ "title": "Lambda Core", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - Lambda Core.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 28, "disk": 1, "time": 75 },
	{ "title": "End Credits Part 1", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - End Credits Part 1.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 29, "disk": 1, "time": 87 },
	{ "title": "End Credits Part 2", "location": "https://dl.dropboxusercontent.com/u/177483060/black_mesa_ost/Joel Nielsen - BMS - End Credits Part 2.mp3", "artwork": "packages/albums/placeholders/black_mesa.jpg", "artists": ["Joel Nielsen"], "album": "Black Mesa", "year": 2012, "track": 30, "disk": 1, "time": 116 },

	{ "title": "Science Is Fun", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-01-Science_Is_Fun.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 01, "disk": 1, "time": 153 },
	{ "title": "Concentration Enhancing Menu Initialiser", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-02-Concentration_Enhancing_Menu_Initialiser.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 02, "disk": 1, "time": 137 },
	{ "title": "9999999", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-03-999999.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 03, "disk": 1, "time": 191 }, { "title": "Concentration Enhancing Menu Initialiser", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-02-Concentration_Enhancing_Menu_Initialiser.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 02, "disk": 1, "time": 137 },
	{ "title": "The Courtesy Call", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-04-The_Courtesy_Call.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 04, "disk": 1, "time": 217 },
	{ "title": "Technical Difficulties", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-05-Technical_Difficulties.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 05, "disk": 1, "time": 202 },
	{ "title": "Overgrowth", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-06-Overgrowth.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 06, "disk": 1, "time": 171 },
	{ "title": "Ghost of Rattman", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-07-Ghost_of_Rattman.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 07, "disk": 1, "time": 246 },
	{ "title": "Haunted Panels", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-08-Haunted_Panels.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 08, "disk": 1, "time": 96 },
	{ "title": "The Future Starts With You", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-09-The_Future_Starts_With_You.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 09, "disk": 1, "time": 202 },
	{ "title": "There She Is", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-10-There_She_Is.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 10, "disk": 1, "time": 261 },
	{ "title": "You Know Her?", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-11-You_Know_Her.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 11, "disk": 1, "time": 191 },
	{ "title": "The Friendly Faith Plate", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-12-The_Friendly_Faith_Plate.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 12, "disk": 1, "time": 179 },
	{ "title": "15 Acres of Broken Glass", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-13-15_Acres_of_Broken_Glass.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 13, "disk": 1, "time": 300 },
	{ "title": "Love As a Construct", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-14-Love_As_a_Construct.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 14, "disk": 1, "time": 297 },
	{ "title": "I Saw a Deer Today", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-15-I_Saw_a_Deer_Today.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 15, "disk": 1, "time": 193 },
	{ "title": "Hard Sunshine", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-16-Hard_Sunshine.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 16, "disk": 1, "time": 168 },
	{ "title": "I'm Different", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-17-I_Am_Different.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 17, "disk": 1, "time": 269 },
	{ "title": "Adrenal Vapor", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-18-Adrenal_Vapor.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 18, "disk": 1, "time": 156 },
	{ "title": "Turret Wife Serenade", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-19-Turret_Wife_Serenade.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 19, "disk": 1, "time": 99 },
	{ "title": "I Made It All Up", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-20-I_Made_It_All_Up.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 20, "disk": 1, "time": 236 },
	{ "title": "Comedy = Tragedy + Time", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-21-Comedy_Equals_Tragedy_Plus_Time.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 21, "disk": 1, "time": 210 },
	{ "title": "Triple Laser Phase", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-22-Triple_Laser_Phase.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 22, "disk": 1, "time": 255 },

	{ "title": "You Will Be Perfect", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-01-You_Will_Be_Perfect.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 01, "disk": 2, "time": 160 },
	{ "title": "Halls of Science 4", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-02-Halls_of_Science_4.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 02, "disk": 2, "time": 275 },
	{ "title": "(defun botsbuildbots () (botsbuildbots))", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-03-Bots_Build_Bots.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 03, "disk": 2, "time": 247 }, { "title": "An Accent Beyond", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-04-An_Accent_Beyond.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 04, "disk": 2, "time": 178 },
	{ "title": "Robot Ghost Story", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-05-Robot_Ghost_Story.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 05, "disk": 2, "time": 187 },
	{ "title": "Die Cut Laser Dance", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-06-Die_Cut_Laser_Dance.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 06, "disk": 2, "time": 120 },
	{ "title": "Turret Redemption Line", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-07-Turret_Redemption_Line.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 07, "disk": 2, "time": 203 },
	{ "title": "Bring Your Daughter To Work Day", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-08-Bring_Your_Daughter_To_Work_Day.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 08, "disk": 2, "time": 160 },
	{ "title": "Almost At Fifty Percent", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-09-Almost_At_Fifty_Percent.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 09, "disk": 2, "time": 119 },
	{ "title": "Don't Do It", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-10-Dont_Do_It.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 10, "disk": 2, "time": 316 },
	{ "title": "I AM NOT A MORON", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-11-I_AM_NOT_A_MORON.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 11, "disk": 2, "time": 227 },
	{ "title": "Vitrification Order", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-12_Vitrification_Order.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 12, "disk": 2, "time": 394 },
	{ "title": "Music of the Spheres", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-13-Music_of_the_Spheres.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 13, "disk": 2, "time": 219 },
	{ "title": "You Are Not Part of the Control Group", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-14-You_Are_Not_Part_of_the_Control_Group.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 14, "disk": 2, "time": 204 },
	{ "title": "Forwarding the Cause of Science", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-15-Forwarding_the_Cause_of_Science.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 15, "disk": 2, "time": 221 },
	{ "title": "PotatOS Lament", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-16-PotatOS_Lament.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 16, "disk": 2, "time": 119 },
	{ "title": "The Reunion", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-17-The_Reunion.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 17, "disk": 2, "time": 226 },
	{ "title": "Music of the Spheres 2 (Incendiary Lemons)", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-18-Music_Of_The_Spheres_2(Incendiary_Lemons).mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 18, "disk": 2, "time": 164 },

	{ "title": "Reconstructing More Science", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-01-Reconstructing_More_Science.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 01, "disk": 3, "time": 157 },
	{ "title": "Wheatley Science", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-02-Wheatley_Science.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 02, "disk": 3, "time": 149 },
	{ "title": "Franken Turrets", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-03-FrankenTurrets.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 03, "disk": 3, "time": 248 },
	{ "title": "Machiavellian Bach", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-04-Machiavellian_Bach.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 04, "disk": 3, "time": 242 },
	{ "title": "Excursion Funnel", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-05-Excursion_Funnel.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 05, "disk": 3, "time": 272 },
	{ "title": "TEST", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-06-TEST.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 06, "disk": 3, "time": 374 },
	{ "title": "The Part Where He Kills You", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-07-The_Part_Where_He_Kills_You.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 07, "disk": 3, "time": 203 },
	{ "title": "Omg, What has He Done?", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-08-Omg_What_has_He_Done_.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 08, "disk": 3, "time": 144 },
	{ "title": "Bombs for Throwing at You", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-09-Bombs_for_Throwing_at_You.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 09, "disk": 3, "time": 348 },
	{ "title": "Your Precious Moon", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-10-Your_Precious_Moon.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 10, "disk": 3, "time": 115 },
	{ "title": "Caroline Deleted", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-11-Caroline_Deleted.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 11, "disk": 3, "time": 110 },
	{ "title": "Cara Mia Addio!", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-12-Cara_Mia_Addio.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 12, "disk": 3, "time": 154 },
	{ "title": "Want You Gone", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-13-Want_You_Gone.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 13, "disk": 3, "time": 142 },
	{ "title": "Spaaaaace", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-14-Spaaaaace.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 14, "disk": 3, "time": 46 },
	{ "title": "Space Phase", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-15-Space_Phase.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 15, "disk": 3, "time": 93 },
	{ "title": "Some Assembly Required", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-16-Some_Assembly_Required.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 16, "disk": 3, "time": 111 },
	{ "title": "Robot Waiting Room #1", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-17-Robot_Waiting_Room_%231.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 17, "disk": 3, "time": 134 },
	{ "title": "Robot Waiting Room #2", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-18-Robot_Waiting_Room_%232.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 18, "disk": 3, "time": 134 },
	{ "title": "Robot Waiting Room #3", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-19-Robot_Waiting_Room_%233.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 19, "disk": 3, "time": 134 },
	{ "title": "Robot Waiting Room #4", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-20-Robot_Waiting_Room_%234.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 20, "disk": 3, "time": 134 },
	{ "title": "Robot Waiting Room #5", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-21-Robot_Waiting_Room_%235.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 21, "disk": 3, "time": 134 },
	{ "title": "Robot Waiting Room #6", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-22-Robot_Waiting_Room_%236.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 22, "disk": 3, "time": 126 },
	{ "title": "You Saved Science", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-23-You_Saved_Science.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 23, "disk": 3, "time": 48 },
	{ "title": "Robots FTW", "location": "https://dl.dropboxusercontent.com/u/177483060/portal_2_ost/Portal2-24-Robots_FTW.mp3", "artwork": "packages/albums/placeholders/portal_2.jpg", "artists": ["Aperture Science Psychoacoustics Laboratory"], "album": "Portal 2: Songs to Test By", "year": 2011, "track": 24, "disk": 3, "time": 218 }
];
//////// END DEBUGGING ////////