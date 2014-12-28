// Define package arrays
tb.private.packages = [];
tb.private.erroredPacakges = [];

// Array of paths to found package manifests (currently hardcoded, will later be supplied by backend)
tb.private.locatedManifests = ["packages/songs", "packages/albums", "packages/artists", "packages/tags", "packages/boxes", "packages/trackbox"];

// Returns a read-only copy of installed packages
tb.packages = function () {
	return tb.cloneObject(tb.private.packages);
};

// Returns an array of all package names
tb.listPackages = function () {
	var packages = ["songs", "albums", "artists", "tags", "boxes"];
	return packages;
};

// Checks a given package manifest ensure its validity
tb.isPackageManifestValid = function (manifest) {

	// Check if manifest JSON is valid
	if (typeof manifest !== 'object') {
		console.error("Manifest must be a valid JSON object.");
		return false;
	}

	// Check if manifest contains package name
	if (!('name' in manifest)) {
		console.error("'name' key required.");
		return false;
	}

	// Check if manifest contains repo name
	if (!('repo' in manifest)) {
		console.error("'repo' key required.");
		return false;
	}

	// Check if manifest contains package type
	if (!('type' in manifest)) {
		console.error("'type' key required.");
		return false;
	}

	// Special cases for the page package type
	if (manifest.type === "page") {

		// Check if manifest contains page name
		if (!('pageName' in manifest)) {
			console.error("'pageName' key required.");
			return false;
		}

		// Check if manifest contains page file location
		if (!('page' in manifest)) {
			console.error("'page' key required.");
			return false;
		}

		// Check if manifest contains page navigation URL
		if (!('url' in manifest)) {
			console.error("'url' key required.");
			return false;
		}

		// Check if manifest contains page vanity URL
		if (!('preferredUrl' in manifest)) {
			console.error("'preferredUrl' key required.");
			return false;
		}

		// Check if manifest contains page CSS dependencies in an array
		if (!(manifest.css instanceof Array)) {
			console.error("'css' key must be an array, i.e. [ 'file.css' ]");
			return false;
		}

	} else if (manifest.type === "shell") {
		// Special cases for the shell package type

		// Check if manifest contains shell file location
		if (!('shell' in manifest)) {
			console.error("'shell' key required.");
			return false;
		}

		// Check if manifest contains shell CSS dependencies in an array
		if (!(manifest.css instanceof Array)) {
			console.error("'css' key must be an array, i.e. [ 'file.css' ]");
			return false;
		}
	} else {
		// Invalid package type
		console.error("Package type invalid in the manifest file (does not match 'page', 'shell', etc.)");
		return false;
	}

	return true;
};

// Loads the current shell
tb.loadShellPackage = function () {
	// Locate the shell package from the already loaded packages
	tb.findPackages({ "location": tb.preferences().currentShellPath }, false, function (data) {
		// If it's not already in the list of loaded packages, load it now and mark it as loaded then trigger package loaded
		if (data === null) {
			// Get the manifest
			tb.getJSONFileContents(tb.preferences().currentShellPath + "/manifest.json", function (data) {
				// Add the package location to the manifest data in memory
				data.location = tb.preferences().currentShellPath;
				// Add this package to the list of loaded packages
				tb.private.packages.push(data);
				// Trigger package loaded
				tb.triggerOnShellPackageLoaded();
			});
		} else {
			// Trigger package loaded
			tb.triggerOnShellPackageLoaded();
		}
	});
};

// Loads every package
tb.loadPackages = function () {
	// Go through every package manifest
	for (var manifest in tb.private.locatedManifests) {
		(function () {
			var index = arguments[0];
			// Locate the package being loaded
			tb.findPackages({ "location": tb.private.locatedManifests[index] }, false, function (data) {
				// If it's not already in the list of loaded packages, load it now and mark it as loaded
				if (data === null) {
					// Get the manifest
					tb.getJSONFileContents(tb.private.locatedManifests[index] + "/manifest.json", function (data) {
						// Validate manifest
						if (tb.isPackageManifestValid(data)) {
							// Add the package location to the manifest data in memory
							data.location = tb.private.locatedManifests[index];
							// Add this package to the list of loaded packages
							tb.private.packages.push(data);
						} else {
							// If package manifest is invalid, add it to a list of errored packages
							tb.private.erroredPacakges.push(tb.private.locatedManifests[index]);
						}

						// If every package has been loaded, trigger packages loaded
						if (tb.private.packages.length >= tb.private.locatedManifests.length) {
							tb.triggerOnPackagesLoaded();
						}
					});
				}
			});
		}(manifest));
	}
};

// Calls back with the file location of a package given its repo name
tb.packageLocation = function (repo, callback) {
	// Find the package given its repo name
	tb.findPackages({ "repo": repo }, false, function (data) {
		if (data !== null) {
			// Call back with the location
			callback(data[0].location);
		} else {
			// Produce an error if the package isn't found
			console.error("Unable to find location for package '" + repo + "': Package not found.");
		}
	}, 0); //? Should this be a 1 so it returns only one result or just left blank?
};

// Find a package and return its details
// `paramerters` filters the returned objects, where each item in the JSON object is checked against every pkg.
// `contains` will return a pkg if part of the string matches, instead requiring two identical strings.
// `quantityToReturn` (optional) is the number of packages to return. Useful if you know an attribute, such as `id`, is unique, so you can stop after finding a match.
// Example: tb.findPackages({ "type": "page" }, false, function (pages) { alert(pages[page].name[0] });
tb.findPackages = function (parameters, contains, callback, quantityToReturn) {
	var packages = tb.packages();
	var matchedPackages = [];

	// Execute asynchronously
	setTimeout(function () {

		// If `contains` is true, evaluates whether string 1 contains string 2, else if it equals string 2
		function stringMatches(string1, string2) {
			if (contains) {
				// Return true if string 1 exists in string 2, else false
				return string2.search(string1) >= 0;
			} else {
				// Return true if string 1 equals string 2, else false
				return string1 === string2;
			}
		}

		// Loop through every package
		for (var pkg in packages) {
			// The following checks if various given properties match the properties of this package.
			// The first time a given parameter does not match, `mached` is set to false and all subsequent checks are skipped.

			// Start out assuming the search will match
			var matched = true;

			// Check if name is a given search parameter and that it also exists in this package
			if (parameters.name && packages[pkg].name) {
				// If the name given in the search parameters does not match the one in this package, set matched to false
				matched = stringMatches(parameters.name, packages[pkg].name);
			}
			if (matched && parameters.repo && packages[pkg].repo) {
				matched = stringMatches(parameters.repo, packages[pkg].repo);
			}
			if (matched && parameters.location && packages[pkg].location) {
				matched = stringMatches(parameters.location, packages[pkg].location);
			}
			if (matched && parameters.description) {
				matched = stringMatches(parameters.description, packages[pkg].description);
			}
			if (matched && parameters.page && packages[pkg].page) {
				matched = stringMatches(parameters.page, packages[pkg].page);
			}
			if (matched && parameters.shell && packages[pkg].shell) {
				matched = stringMatches(parameters.shell, packages[pkg].shell);
			}
			if (matched && parameters.pageIcon) {
				matched = stringMatches(parameters.pageIcon, packages[pkg].pageIcon);
			}
			if (matched && parameters.pageName && packages[pkg].pageName) {
				matched = stringMatches(parameters.pageName, packages[pkg].pageName);
			}
			if (matched && parameters.type) {
				matched = stringMatches(parameters.type, packages[pkg].type);
			}
			if (matched && parameters.url) {
				matched = stringMatches(parameters.url, packages[pkg].url);
			}
			if (matched && parameters.preferredUrl) {
				matched = stringMatches(parameters.preferredUrl, packages[pkg].preferredUrl);
			}
			if (matched && parameters.standardUrl) {
				if (packages[pkg].standardUrl === undefined) {
					matched = false;
				} else {
					// Go through every parameter to see if one matches
					for (var standardUrlInParameters in parameters.standardUrl) {
						matched = false;

						// Go through every package to see if one matches
						for (var standardUrlInPackage in packages[pkg].standardUrl) {
							if (!stringMatches(parameters.standardUrl[standardUrlInParameters], packages[pkg].standardUrl[standardUrlInPackage])) {
								matched = true;
								break;
							}
						}

						// If one is found, stop searching the other standard URLs in the parameters
						if (!matched) {
							break;
						}
					}
				}
			}
			if (matched && parameters.css) {
				if (packages[pkg].css === undefined) {
					matched = false;
				} else {
					// Go through every parameter to see if one matches
					for (var cssInParameters in parameters.css) {
						matched = false;

						// Go through every package to see if one matches
						for (var cssInPackage in packages[pkg].css) {
							if (!stringMatches(parameters.css[cssInParameters], packages[pkg].css[cssInPackage])) {
								matched = true;
								break;
							}
						}

						// If one is found, stop searching the other standard URLs in the parameters
						if (!matched) {
							break;
						}
					}
				}
			}

			// If every given parameter matched this package's properties
			if (matched) {
				// Add this package to the list of matched packages
				matchedPackages.push(tb.cloneObject(packages[pkg]));

				// Stop searching if the number of plugins is greater than the quantity to return
				if (quantityToReturn > 0 && matchedPackages.length >= quantityToReturn) {
					break;
				}
			}
		}

		// After searching, call back with result
		if (matchedPackages.length > 0) {
			// Call back with the array of packages
			callback(matchedPackages);
		} else {
			// Call back null when no packages were found
			callback(null);
		}
	}, 0);
};
