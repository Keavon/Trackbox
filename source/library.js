// Initialize the database
tb.private.libraryDb = new PouchDB("library", function () {
	tb.triggerOnLibraryReady();
});

////////// DEBUGGING //////////
tb.addLibrary = function () {
	tb.getJSONFileContents("users/default/library.json", function (data) {
		tb.private.libraryDb.bulkDocs(data);
	});
};
tb.destroyLibrary = function () {
	PouchDB.destroy('library');
};
//////// END DEBUGGING ////////

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
