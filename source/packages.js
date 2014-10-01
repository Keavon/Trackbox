tb.private.packages = [];
tb.private.erroredPacakges = [];

//Array of paths to found package manifests.
tb.private.locatedManifests = ["packages/albums", "packages/artists",
															"packages/songs", "packages/tags", "packages/trackbox"];

// Return a read only copy of installed packages.
tb.packages = function() {
	return tb.copyJSON(tb.private.packages);
};

﻿tb.listPackages = function () {
	var packages = ["songs", "albums", "artists", "tags", "boxes"];
	return packages;
};

//TODO: Remove once package system is up.
tb.packageStartup = function () {
	var packages = tb.listPackages();
	for (var packs in packages) {
		var packPath = "packages/" + packages[packs] + "/startup.js";

		tb.getFileContents(packPath, function (script) {
			script = '<script type="text/javascript">' + script;
			script += '</' + 'script>';
			$("head").append(script);
		});
	}
};

// Check a package manifest to make sure it is valid
tb.isPackageManifestValid = function (manifest) {
	if (typeof manifest !== 'object') {
		console.error("Manifest must be a valid JSON object.");
		return false;
	}

	if (!('name' in manifest)) {
		console.error("'name' key required.");
		return false;
	}

	if (manifest.type === "page") {
		if (!('pageName' in manifest)) {
			console.error("'pageName' key required.");
			return false;
		}

		if (!('page' in manifest)) {
			console.error("'page' key required.");
			return false;
		}

		if (!('url' in manifest)) {
			console.error("'url' key required.");
			return false;
		}

		if (!('standardUrl' in manifest)) {
			console.error("'standardUrl' key required.");
			return false;
		}

		if (!(manifest.standardUrl instanceof Array)) {
			console.error("'standardUrl' key is required to be a array ( i.e. ['url'])");
			return false;
		}
	} else if (manifest.type === "shell") {
		if (!('shell' in manifest)) {
			console.error("'shell' key required.");
			return false;
		}
	} else {
		console.error("You must set a valid package type (page, shell) in the manifest file.");
		return false;
	}

	return true;
};

tb.loadShellPackage = function() {
	tb.findPackage({"location" : (tb.preferences()).currentShellPath}, false, function(data) {
		if(data === null) {
			tb.getJSONFileContents((tb.preferences()).currentShellPath + "/manifest.json", function(data) {
				data.location = (tb.preferences()).currentShellPath;
				data.id = data.name;
				tb.private.packages.push(data);
				tb.triggerOnShellPackageLoaded();
			});
		} else {
			tb.triggerOnShellPackageLoaded();
		}
	});
};

tb.loadPackages = function () {
	for(var manifest in tb.private.locatedManifests) {
		(function() {
			var index = arguments[0];

			tb.findPackage({"location" : tb.private.locatedManifests[index]}, false, function(data) {
				if(data === null) {
					tb.getJSONFileContents(tb.private.locatedManifests[index] + "/manifest.json", function(data) {
						if (tb.isPackageManifestValid(data)) {
							data.location = tb.private.locatedManifests[index];
							data.id = data.name;
							tb.private.packages.push(data);
						} else {
							tb.private.erroredPacakges.push(tb.private.locatedManifests[index]);
						}

						// If every package has been loaded trigger onPackagesLoaded event.
						if(tb.private.packages.length >= tb.private.locatedManifests.length) {
							tb.triggerOnPackagesLoaded();
						}
					});
				}
			});
		}(manifest));
	}
};

// Find a package and return its details.
// Paramerters filters the returned objects, where each item in the JSON object is checked against every songs metadata.
// quantityToReturn is the number of packages to return. Useful if you know the an attribute, like id, is unique, so you can stop after finding a match.
// contains will return a package if part of the string matches, instead requiring two identical strings.
tb.findPackage = function (parameters, contains, callback, quantityToReturn) {
	var packages = tb.packages();
	var matchedPackages = [];

	setTimeout(function () {
		function stringMatches(stringOne, stringTwo) {
			if (contains) {
				if (stringTwo.search(stringOne) >= 0) {
					return true;
				} else {
					return false;
				}
			} else {
					if (stringOne === stringTwo) {
						return true;
					} else {
						return false;
					}
				}
		}

		for(var package in packages) {
			var matched = true;

			if (parameters.name && packages[package].name && matched !== false) {
				if (!stringMatches(parameters.name, packages[package].name)) {
					matched = false;
				}
			}

			if (parameters.id && packages[package].id && matched !== false) {
				if (!stringMatches(parameters.id, packages[package].id)) {
					matched = false;
				}
			}

			if (parameters.location && packages[package].location && matched !== false) {
				if (!stringMatches(parameters.location, packages[package].location)) {
					matched = false;
				}
			}

			if (parameters.description && matched !== false) {
				if (packages[package].description === undefined || !stringMatches(parameters.description, packages[package].description)) {
					matched = false;
				}
			}

			if (parameters.page && packages[package].page && matched !== false) {
				if (packages[package].page === undefined || !stringMatches(parameters.page, packages[package].page)) {
					matched = false;
				}
			}

			if (parameters.shell && packages[package].shell && matched !== false) {
				if (packages[package].shell === undefined || !stringMatches(parameters.shell, packages[package].shell)) {
					matched = false;
				}
			}

			if (parameters.pageIcon  && matched !== false) {
				if (packages[package].pageIcon === undefined || !stringMatches(parameters.pageIcon, packages[package].pageIcon)) {
					matched = false;
				}
			}

			if (parameters.pageName && packages[package].pageName && matched !== false) {
				if (!stringMatches(parameters.pageName, packages[package].pageName)) {
					matched = false;
				}
			}

			if (parameters.type && matched !== false) {
				if (!stringMatches(parameters.type, packages[package].type)) {
					matched = false;
				}
			}

			if (parameters.url && matched !== false) {
				if (packages[package].url === undefined ||!stringMatches(parameters.url, packages[package].url)) {
					matched = false;
				}
			}

			if (parameters.standardUrl && matched !== false) {
				if (packages[package].standardUrl === undefined) {
					matched = false;
				} else {
					for (var i in parameters.standardUrl) {
						var urlMatched = false;

						for (var r in packages[package].standardUrl) {
							if (!stringMatches(parameters.standardUrl[i], packages[package].standardUrl[r])) {
								urlMatched = true;
							}
						}
						if (urlMatched !== true) {
							matched = false;
						}

						if (matched === false) {
							break;
						}
					}
				}
			}

			if (matched === true ) {
				matchedPackages.push(tb.copyJSON(packages[package]));
				if ( matchedPackages.length >= (quantityToReturn || Number.MAX_VALUE)) {
					break;
				}
			}
		}

		if (matchedPackages.length > 0 ) {
			callback(matchedPackages);
		} else {
			callback(null);
		}
	}, 0);
};
