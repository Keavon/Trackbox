tb.listPackages = function () {
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
