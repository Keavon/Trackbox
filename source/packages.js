tb.private.packages = [];
tb.private.erroredPacakges = [];

//Array of paths to found pkg manifests.
tb.private.locatedManifests = ["packages/songs", "packages/albums", "packages/artists", "packages/tags", "packages/boxes", "packages/trackbox"];

// Return a read only copy of installed packages.
tb.packages = function () {
	return tb.copyJSON(tb.private.packages);
};

tb.listPackages = function () {
	var packages = ["songs", "albums", "artists", "tags", "boxes"];
	return packages;
};

// Check a pkg manifest to make sure it is valid
tb.isPackageManifestValid = function (manifest) {
	if (typeof manifest !== 'object') {
		console.error("Manifest must be a valid JSON object.");
		return false;
	}

	if (!('name' in manifest)) {
		console.error("'name' key required.");
		return false;
	}

	if (!('repo' in manifest)) {
		console.error("'repo' key required.");
		return false;
	}

	if (!('type' in manifest)) {
		console.error("'type' key required.");
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

		if (!('preferredUrl' in manifest)) {
			console.error("'preferredUrl' key required.");
			return false;
		}

		if (('preferredUrl' in manifest) && !(manifest.css instanceof Array)) {
			console.error("'css' key is required to be an array, i.e. ['file.css']");
			return false;
		}
	} else if (manifest.type === "shell") {
		if (!('shell' in manifest)) {
			console.error("'shell' key required.");
			return false;
		}

		if (('preferredUrl' in manifest) && !(manifest.css instanceof Array)) {
			console.error("'css' key is required to be an array, i.e. ['file.css']");
			return false;
		}
	} else {
		console.error("pkg type invalid in the manifest file (does not match 'page', 'shell', etc.)");
		return false;
	}

	return true;
};

tb.loadShellPackage = function () {
	tb.findPackages({ "location": tb.preferences().currentShellPath }, false, function (data) {
		if (data === null) {
			tb.getJSONFileContents(tb.preferences().currentShellPath + "/manifest.json", function (data) {
				data.location = tb.preferences().currentShellPath;
				tb.private.packages.push(data);
				tb.triggerOnShellPackageLoaded();
			});
		} else {
			tb.triggerOnShellPackageLoaded();
		}
	});
};

tb.loadPackages = function () {
	for (var manifest in tb.private.locatedManifests) {
		(function () {
			var index = arguments[0];

			tb.findPackages({ "location": tb.private.locatedManifests[index] }, false, function (data) {
				if (data === null) {
					tb.getJSONFileContents(tb.private.locatedManifests[index] + "/manifest.json", function (data) {
						if (tb.isPackageManifestValid(data)) {
							data.location = tb.private.locatedManifests[index];
							tb.private.packages.push(data);
						} else {
							tb.private.erroredPacakges.push(tb.private.locatedManifests[index]);
						}

						// If every pkg has been loaded trigger onPackagesLoaded event.
						if (tb.private.packages.length >= tb.private.locatedManifests.length) {
							tb.triggerOnPackagesLoaded();
						}
					});
				}
			});
		}(manifest));
	}
};

tb.packageLocation = function (repo, callback) {
	tb.findPackages({ "repo": repo }, false, function (data) {
		if (data !== null) {
			callback(data[0].location);
		} else {
			console.error("Location for pkg '" + repo + "' not found.");
		}
	}, 0);
};

// Find a pkg and return its details.
// `paramerters` filters the returned objects, where each item in the JSON object is checked against every pkg.
// `contains` will return a pkg if part of the string matches, instead requiring two identical strings.
// `quantityToReturn` (optional) is the number of packages to return. Useful if you know an attribute, such as `id`, is unique, so you can stop after finding a match.
// Example: tb.findPackages({ "type": "page" }, false, function (pages) { alert(pages[page].name[0] });
tb.findPackages = function (parameters, contains, callback, quantityToReturn) {
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

		for (var pkg in packages) {
			var matched = true;

			if (parameters.name && packages[pkg].name && matched !== false) {
				if (!stringMatches(parameters.name, packages[pkg].name)) {
					matched = false;
				}
			}

			if (parameters.repo && packages[pkg].repo && matched !== false) {
				if (!stringMatches(parameters.repo, packages[pkg].repo)) {
					matched = false;
				}
			}

			if (parameters.location && packages[pkg].location && matched !== false) {
				if (!stringMatches(parameters.location, packages[pkg].location)) {
					matched = false;
				}
			}

			if (parameters.description && matched !== false) {
				if (packages[pkg].description === undefined || !stringMatches(parameters.description, packages[pkg].description)) {
					matched = false;
				}
			}

			if (parameters.page && packages[pkg].page && matched !== false) {
				if (packages[pkg].page === undefined || !stringMatches(parameters.page, packages[pkg].page)) {
					matched = false;
				}
			}

			if (parameters.shell && packages[pkg].shell && matched !== false) {
				if (packages[pkg].shell === undefined || !stringMatches(parameters.shell, packages[pkg].shell)) {
					matched = false;
				}
			}

			if (parameters.pageIcon && matched !== false) {
				if (packages[pkg].pageIcon === undefined || !stringMatches(parameters.pageIcon, packages[pkg].pageIcon)) {
					matched = false;
				}
			}

			if (parameters.pageName && packages[pkg].pageName && matched !== false) {
				if (!stringMatches(parameters.pageName, packages[pkg].pageName)) {
					matched = false;
				}
			}

			if (parameters.type && matched !== false) {
				if (!stringMatches(parameters.type, packages[pkg].type)) {
					matched = false;
				}
			}

			if (parameters.url && matched !== false) {
				if (packages[pkg].url === undefined || !stringMatches(parameters.url, packages[pkg].url)) {
					matched = false;
				}
			}

			if (parameters.preferredUrl && matched !== false) {
				if (packages[pkg].preferredUrl === undefined || !stringMatches(parameters.preferredUrl, packages[pkg].preferredUrl)) {
					matched = false;
				}
			}

			if (parameters.standardUrl && matched !== false) {
				if (packages[pkg].standardUrl === undefined) {
					matched = false;
				} else {
					for (var i in parameters.standardUrl) {
						var urlMatched = false;

						for (var r in packages[pkg].standardUrl) {
							if (!stringMatches(parameters.standardUrl[i], packages[pkg].standardUrl[r])) {
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

			if (parameters.css && matched !== false) {
				if (packages[pkg].css === undefined) {
					matched = false;
				} else {
					for (var parameterKey in parameters.css) {
						var cssMatched = false;

						for (var packageKey in packages[pkg].css) {
							if (!stringMatches(parameters.css[parameterKey], packages[pkg].css[packageKey])) {
								cssMatched = true;
							}
						}
						if (cssMatched !== true) {
							matched = false;
						}

						if (matched === false) {
							break;
						}
					}
				}
			}

			if (matched === true) {
				matchedPackages.push(tb.copyJSON(packages[pkg]));
				if (matchedPackages.length >= (quantityToReturn || Number.MAX_VALUE)) {
					break;
				}
			}
		}

		if (matchedPackages.length > 0) {
			callback(matchedPackages);
		} else {
			callback(null);
		}
	}, 0);
};
