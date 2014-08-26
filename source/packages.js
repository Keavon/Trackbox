tb.private.packages = [];

//Array of paths to found package manifests.
tb.private.locatedManifests = ["packages/albums/manifest.json", "packages/artists/manifest.json",
															"packages/songs/manifest.json", "packages/tags/manifest.json", "packages/trackbox/manifest.json"];

// Return a read only copy of installed packages.
tb.packages = function() {
	var toReturn = $.parseJSON(JSON.stringify(tb.private.packages));
	return toReturn;
};

﻿tb.listPackages = function () {
	var packages = ["songs", "albums", "artists", "tags", "boxes"];
	return packages;
};

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

tb.loadPackages = function () {
	for (var manifest in tb.private.locatedManifests) {
		tb.getJSONFileContents(tb.private.locatedManifests[manifest], function (data) {
			if (tb.isPackageManifestValid(data)) {
				tb.private.packages.push(data);
			}
		});
	}
};
