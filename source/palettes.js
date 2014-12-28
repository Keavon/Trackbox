// Temporary hardcoded palette colors
var palettes = {
	"background1": "#ffffff",
	"background2": "#f5f5f5",
	"background3": "#eeeeee",
	"background4": "#e4e4e4",
	"background5": "#cccccc",
	"accent1": "#33b5e5",
	"accent2": "#42acd3",
	"solid1": "#333333",
	"solid2": "#666666",
	"solid3": "#999999"
};

// Renders palette templates given the package path and the file name to be rendered
tb.renderPalette = function (packagePath, paletteFile, callback) {
	tb.getFileContents(packagePath + "/" + paletteFile, function (palette) {
		tb.renderTextPalette(packagePath, palette, function (rendered) {
			callback(rendered);
		});
	});
};

// Renders palette templates given the package path and the textual content to be rendered
tb.renderTextPalette = function (packagePath, palette, callback) {
	// Replace //PACKAGE// with the path to the package
	palette = palette.replace(/\/\/PACKAGE\/\//g, packagePath + "/");

	// Matches ||  || tags
	var replacement = palette.match(/\|\|((?:(?!\|\|).)+)\|\|/g);

	// Replace template tags
	for (var item in replacement) {
		// Get iteration's match
		var replacementsKey = replacement[item];

		// Remove ||  || tags
		var cleanReplacementKey = replacementsKey.substring(2, replacementsKey.length - 2);

		// Checks if a key is in the palettes and replaces it
		if (cleanReplacementKey in palettes) {
			palette = palette.replace(replacementsKey, palettes[cleanReplacementKey]);
		}
	}

	// Call back with the rendered pallet text
	callback(palette);
};