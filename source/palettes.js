var palettes = {
	"background1": "#ffffff",
	"background2": "#f5f5f5",
	"background3": "#eeeeee",
	"background4": "#e4e4e4",
	"background5": "#cccccc",
	"hint1": "#33b5e5",
	"hint2": "#42acd3",
	"solid1": "#333333",
	"solid2": "#666666",
	"solid3": "#999999"
};

tb.renderPalette = function (repoPath, paletteFile, callback) {
	tb.getFileContents(repoPath + "/" + paletteFile, function (palette) {
		tb.renderTextPalette(repoPath, palette, function (rendered) {
			callback(rendered);
		});
	});
};

tb.renderTextPalette = function (repoPath, palette, callback) {
	// Matches || || tags
	var match = new RegExp("//PACKAGE//", "g");
	palette = palette.replace(match, repoPath + "/");

	var replacement = palette.match(/\|\|((?:(?!\|\|).)+)\|\|/g);

	if (cleanReplacementKey === "PACKAGE") {
		alert(repoPath);
		palette = palette.replace("PACKAGE", repoPath);
	}


	// Replace template tags
	for (var item in replacement) {
		// Get iteration's match
		var replacementsKey = replacement[item];

		// Remove || || tags
		var cleanReplacementKey = replacementsKey.substring(2, replacementsKey.length - 2);

		// Checks if a key is in the palettes and replaces it
		if (cleanReplacementKey in palettes) {
			palette = palette.replace(replacementsKey, palettes[cleanReplacementKey]);
		}
	}
	callback(palette);
};